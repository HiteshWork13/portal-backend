import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import { HistoryExportEntity } from 'src/entities/history_export.entity';
import { Document } from 'src/models/document.model';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Repository } from 'typeorm';

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


}
