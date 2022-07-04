import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HistoryExportEntity } from "src/entities/history_export.entity";
import { QueryService } from "src/shared/services/query.service";
import { Brackets, Repository } from "typeorm";
import moment from "moment";
import * as _ from "lodash";
import { AccountEntity } from "src/entities/account.entity";
import { Cron } from "@nestjs/schedule";

@Injectable()

// export interface AxiosResponse<T = never>  {
//     data: T;
//     status: number;
//     statusText: string;
//     headers: Record<string, string>;
//     request?: any;
//   }
export class HistoryExportService {
  api_key = "8f2d5b03-5c9f-4e96-b386-a47a598422ce";
  body: Array<any>;

  constructor(
    @InjectRepository(HistoryExportEntity)
    private History: Repository<HistoryExportEntity>,
    @InjectRepository(AccountEntity)
    private Account: Repository<AccountEntity>,
    private queryService: QueryService
  ) {}

  @Cron("0 0 * * *", {
    name: "hubspot",
    timeZone: "Asia/Calcutta",
  })
  triggerMessage() {
    this.getOlderClient2();
  }

  /* stopCronJob() {
              const job = this.schedulerRegistry.getCronJob('hubspot');
              job.stop();
          } */

  insertDefault() {
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

    var yesterdaysRecord = this.History.createQueryBuilder("h")
      .select("h.client_id", "client_id")
      .addSelect("h.timestamp", "yesterday_exported")
      .distinctOn(["h.client_id"])
      .where("to_char(h.timestamp, 'YYYY-MM-DD') = :yesterday", { yesterday });
    var yesterdayRecordsResult: Array<any> =
      await yesterdaysRecord.getRawMany();
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
    prevRecordsResult = _.merge(prevRecordsResult, yesterdayRecordsResult);
    const result = {};
    await this.v1ApiHubspot().then((response) => {
      let abc = this.mapHubspotContacts(prevRecordsResult, response);
    });
    result["data"] = prevRecordsResult;
    return result;
  }

  readContacts() {
    const hubspot = require("@hubspot/api-client");

    const hubspotClient = new hubspot.Client({ apiKey: this.api_key });

    const limit = 10;
    const archived = false;
    const after = undefined;
    const properties = undefined;
    const propertiesWithHistory = undefined;
    const associations = undefined;

    try {
      const apiResponse = hubspotClient.crm.contacts.basicApi.getPage(
        limit,
        after,
        properties,
        propertiesWithHistory,
        associations,
        archived
      );
    } catch (e) {
      e.message === "HTTP request failed"
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e);
    }
  }

  v1ApiHubspot(): Promise<any> {
    return new Promise((resolve, reject) => {
      var request = require("request");
      var options = {
        method: "GET",
        url: "https://api.hubapi.com/crm/v3/objects/contacts",
        qs: { hapikey: this.api_key, limit: 10, archived: false },
        headers: { "Content-Type": "application/json" },
        json: true,
      };
      request(options, async function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(response.body["results"]);
        }
      });
    });
  }

  mapHubspotContacts(allClients, data) {
    let tempArr = [];
    data.forEach((element) => {
      tempArr[element.properties.email] = element;
    });
    this.body = [];
    allClients.forEach((user) => {
      const obj = {};
      if (tempArr[user.email]) {
        let temp_arr = {
          last_used: this.getDateFormat(user.yesterday_exported),
          previously_used: this.getDateFormat(user.previously_exported),
        };
        obj["id"] = tempArr[user.email].id;
        obj["properties"] = temp_arr
        this.body.push(obj);
      }
    });
     this.v3ApiHubspot(this.body);
  }

  v3ApiHubspot(body) : Promise<any> {
    return new Promise((resolve, reject) => {
    const hubspot = require("@hubspot/api-client");

    const hubspotClient = new hubspot.Client({ apiKey: this.api_key });

    const BatchInputSimplePublicObjectBatchInput = { inputs: body };

    try {
      const apiResponse = hubspotClient.crm.contacts.batchApi.update(
        BatchInputSimplePublicObjectBatchInput
      );
    } catch (e) {
      // e.message === "HTTP request failed"
      //   ? console.error("response", JSON.stringify(e.response, null, 2))
      //   : console.error("error", e);
      if (e.message === "HTTP request failed") {
        reject(e);
      } else {
        resolve(e.response);
      }
    }
    })
  }

  getDateFormat(date: any) {
    let qw: any = Date.parse(date);
    date = new Date(qw);
    let f_date = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    return Number(f_date);
  }
}
