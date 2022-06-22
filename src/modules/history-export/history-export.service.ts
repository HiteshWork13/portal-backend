import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryExportEntity } from 'src/entities/history_export.entity';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Brackets, Repository } from 'typeorm';
import moment from "moment";

@Injectable()
export class HistoryExportService {

    constructor(
        @InjectRepository(HistoryExportEntity)
        private History: Repository<HistoryExportEntity>,
        private utils: UtilsService,
        private queryService: QueryService
    ) {

    }

    insertDefault() {
        console.log("insert");
        const doc: any = this.History.create({
            client_id: '25dbe70d-d6a6-4f6d-980e-e6fee4f6ca81',
            mac: 'fas1f3as13f1-fasd35f4-fa5s46f',
            length: 10,
            version: '1.0.0'
        })
        this.History.save(doc);
    }

    async findHistoryByClientId(filter) {
        const searchFields = {
            'history.id': 'uuid',
            'history.client_id': 'uuid',
            'mac': 'text',
            'version': 'text'
        }

        var query = this.History.createQueryBuilder('history')
            .where('history.client_id = :client_id', { client_id: filter['client_id'] })

        query = await this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

        const count = await query.getCount();
        const result = { count };

        query = await this.queryService.ApplyPaginationToQuery(query, filter, 'history');
        if ('offset' in filter && filter.offset) {
            result['offset'] = filter['offset'];
        }
        if ('limit' in filter && filter.limit) {
            result['limit'] = filter.limit;
        }

        // query : select * from account where account.created_by == adminId or account.created_by in [sub admin's id <get sub admin ids via sub query>]
        const data = await query.getMany();
        result['data'] = data;

        return result;
    }

    async getOlderClient() {
        const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
        const beforeThreeMonth = moment().subtract(3, 'months').format("YYYY-MM-DD");

        /* Records which has timestamp from today to last three month (to ignore this ids) */
        var query = this.History.createQueryBuilder('h')
            .select("h.client_id, COUNT(h.timestamp)")
            .where(new Brackets(async (qry) => {
                qry.where("to_char(h.timestamp, 'YYYY-MM-DD') < :yesterday", { yesterday })
                qry.andWhere("to_char(h.timestamp, 'YYYY-MM-DD') > :beforeThreeMonth", { beforeThreeMonth })
            })
            ).groupBy("h.client_id")
        var excluded: Array<any> = await query.getRawMany()
        excluded = excluded.map(item => { return item.client_id })

        /* Records which has yesterday record */
        var midQuery = this.History.createQueryBuilder('h')
            .select("h.client_id")
            .distinctOn(["h.client_id"])

        if (excluded.length > 0) {
            midQuery.where(`h.client_id NOT IN (:...excluded)`, { excluded })
        }
        midQuery.andWhere("to_char(h.timestamp, 'YYYY-MM-DD') = :yesterday", { yesterday })
        var middle: Array<any> = (await midQuery.getMany()).map(item => { return item.client_id });

        /* Records which has yesterday record & three month before records */
        var mainQuery = this.History.createQueryBuilder('h')
            .select("h.client_id")
            .distinctOn(["h.client_id"])

        mainQuery.where("to_char(h.timestamp, 'YYYY-MM-DD') <= :beforeThreeMonth", { beforeThreeMonth })
        if (middle.length > 0) {
            mainQuery.andWhere(`h.client_id IN (:...middle)`, { middle })
        }

        const result = {};
        const data = await mainQuery.getMany();
        result['data'] = data;
        return result;
    }


}
