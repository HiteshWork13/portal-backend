import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { HistoryExportDrEntity } from 'src/entities/history_export_dr.entity';
import { Brackets, Repository } from "typeorm";
import { QueryService } from "src/shared/services/query.service";


@Injectable()
export class HistoryExportDrService {

    constructor(
        @InjectRepository(HistoryExportDrEntity)
        private History: Repository<HistoryExportDrEntity>,
        private queryService: QueryService
    ){}

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
}
