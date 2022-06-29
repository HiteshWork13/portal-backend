import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HistoryExportEntity } from "src/entities/history_export.entity";
import { QueryService } from "src/shared/services/query.service";
import { UtilsService } from "src/shared/services/utils.service";
import { Brackets, Repository } from "typeorm";
import moment from "moment";
import * as _ from "lodash";
import { level, logger } from "src/config";
import { AccountEntity } from "src/entities/account.entity";
import { Cron } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class HistoryExportService {
    api_key = "8f2d5b03-5c9f-4e96-b386-a47a598422ce";
    body: Array<any>;

    constructor(
        @InjectRepository(HistoryExportEntity)
        private History: Repository<HistoryExportEntity>,
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>,
        private utils: UtilsService,
        private queryService: QueryService,
        private readonly httpService: HttpService
    ) { }

    @Cron("0 0 * * *", {
        name: "hubspot",
        timeZone: "Asia/Calcutta",
    })
    triggerMessage() {
        this.getOlderClient();
    }

    /* stopCronJob() {
              const job = this.schedulerRegistry.getCronJob('hubspot');
              job.stop();
          } */

    insertDefault() {
        console.log("insert");
        const doc: any = this.History.create({
            client_id: "25dbe70d-d6a6-4f6d-980e-e6fee4f6ca81",
            mac: "fas1f3as13f1-fasd35f4-fa5s46f",
            length: 10,
            version: "1.0.0",
        });
        this.History.save(doc);
    }

    async findHistoryByClientId(filter) {
        const searchFields = {
            "history.id": "uuid",
            "history.client_id": "uuid",
            mac: "text",
            version: "text",
        };

        var query = this.History.createQueryBuilder("history").where(
            "history.client_id = :client_id",
            { client_id: filter["client_id"] }
        );

        query = await this.queryService.ApplySearchToQuery(
            query,
            filter,
            Object.entries(searchFields)
        );

        const count = await query.getCount();
        const result = { count };

        query = await this.queryService.ApplyPaginationToQuery(
            query,
            filter,
            "history"
        );
        if ("offset" in filter && filter.offset) {
            result["offset"] = filter["offset"];
        }
        if ("limit" in filter && filter.limit) {
            result["limit"] = filter.limit;
        }

        // query : select * from account where account.created_by == adminId or account.created_by in [sub admin's id <get sub admin ids via sub query>]
        const data = await query.getMany();
        result["data"] = data;

        return result;
    }

    async getOlderClient() {
        const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
        const beforeThreeMonth = moment()
            .subtract(3, "months")
            .format("YYYY-MM-DD");

        /* Records which has timestamp from today to last three month (to ignore this ids) */
        var query = this.History.createQueryBuilder("h")
            .select("h.client_id, COUNT(h.timestamp)")
            .where(
                new Brackets(async (qry) => {
                    qry.where("to_char(h.timestamp, 'YYYY-MM-DD') < :yesterday", {
                        yesterday,
                    });
                    qry.andWhere(
                        "to_char(h.timestamp, 'YYYY-MM-DD') > :beforeThreeMonth",
                        { beforeThreeMonth }
                    );
                })
            )
            .groupBy("h.client_id");
        var excluded: Array<any> = await query.getRawMany();
        excluded = excluded.map((item) => {
            return item.client_id;
        });

        /* Records which has yesterday record */
        var midQuery = this.History.createQueryBuilder("h")
            .select("h.client_id")
            .distinctOn(["h.client_id"]);

        if (excluded.length > 0) {
            midQuery.where(`h.client_id NOT IN (:...excluded)`, { excluded });
        }
        midQuery.andWhere("to_char(h.timestamp, 'YYYY-MM-DD') = :yesterday", {
            yesterday,
        });
        var middle: Array<any> = (await midQuery.getMany()).map((item) => {
            return item.client_id;
        });

        /* Records which has yesterday record & three month before records */
        var mainQuery = this.History.createQueryBuilder("h")
            .select("h.client_id")
            .distinctOn(["h.client_id"]);

        mainQuery.where("to_char(h.timestamp, 'YYYY-MM-DD') <= :beforeThreeMonth", {
            beforeThreeMonth,
        });
        if (middle.length > 0) {
            mainQuery.andWhere(`h.client_id IN (:...middle)`, { middle });
        }

        const result = {};
        const data = await mainQuery.getMany();
        result["data"] = data;
        return result;
    }

    async getOlderClient2() {
        const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
        // logger.log(level.info, `yesterday:${yesterday}`);

        var yesterdaysRecord = this.History.createQueryBuilder("h")
            .select("h.client_id", "client_id")
            .addSelect("h.timestamp", "yesterday_exported")
            .distinctOn(["h.client_id"])
            .where("to_char(h.timestamp, 'YYYY-MM-DD') = :yesterday", { yesterday });
        var yesterdayRecordsResult: Array<any> =
            await yesterdaysRecord.getRawMany();
        console.log("prevRecordsResult: ", yesterdayRecordsResult);
        const yesterdaysId = yesterdayRecordsResult.map((item) => {
            return item.client_id;
        });
        // const yesterdaysId = [];

        var subquery = this.History.createQueryBuilder("h")
            .select(
                `ROW_NUMBER()  OVER ( PARTITION BY client_id  ORDER BY "timestamp" DESC)`,
                "row_number"
            )
            .addSelect("h.*")
            .addSelect("h.timestamp", "previously_exported")
            .where("h.client_id IN (:...yesterdaysId)", { yesterdaysId });

        /* Join with account table to get email id which has yesterday's record in export history */
        var subquery2 = this.Account.createQueryBuilder("account")
            .select("account.enduser_email", "email")
            .addSelect("account.id", "client_id")
            .where("account.id IN (:...yesterdaysId)", { yesterdaysId });

        var prevRecords = this.History.createQueryBuilder("x")
            .select("sub.*")
            .addSelect("account_sub_qry.*")
            .distinctOn(["account_sub_qry.client_id"])
            .from(`(${subquery.getQuery()})`, "sub")
            .addFrom(`(${subquery2.getQuery()})`, "account_sub_qry")
            .setParameters(subquery.getParameters())
            .setParameters(subquery2.getParameters())
            .where("sub.client_id = account_sub_qry.client_id")
            .andWhere("sub.row_number = 2");
        var prevRecordsResult = await prevRecords.getRawMany();
        // logger.log(level.info, `previous records Query: ${prevRecords.getQuery()}`);
        prevRecordsResult = _.merge(prevRecordsResult, yesterdayRecordsResult);
        const result = {};
        this.updateHubspot(prevRecordsResult);
        // logger.log(level.info, `ABC:${this.utils.beautify(abc)}`);
        result["data"] = prevRecordsResult;
        return result;
    }

    updateHubspot(data) {
        var body1 = [
            {
                email: "super_acc12345@gmail.com",
                properties: [
                    {
                        property: "last_used",
                        value: this.getDateFormat("2022-06-20T22:39:05.206Z"),
                    },
                    {
                        property: "previously_used",
                        value: this.getDateFormat("2022-06-19T22:39:05.206Z"),
                    },
                ],
            },
        ];
        logger.log(level.info, `O-O-O-O-O-O-O-O-O-O-O-O--O-OO-O-O-O-O-O-O-OO-S:${this.utils.beautify(body1)}`);
        this.httpService.post(
            `https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=${this.api_key}`,
            body1
        );
    }

    getDateFormat(date: any) {
        let qw: any = Date.parse(date);
        date = new Date(qw);
        let f_date = Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        );
        return f_date
    }

    hubspotPropertyFormat() {
        // this.body = [];
        // const obj = {};
        /* data.forEach((element) => {
          if (element.email !== undefined) {
            logger.log(level.info, `HERE EMAIL IS: ${element.email}`);
            (obj["email"] = element.email),
              (obj["properties"] = [
                {
                  property: "last_used",
                  value: element.yesterday_exported,
                },
                {
                  property: "previously_used",
                  value: element.previously_exported,
                },
              ]),
              this.body.push(obj);
              logger.log(level.info, `OBJECT:${this.utils.beautify(this.body)}`);
            return this.body;
          }
        }); */
    }
}
