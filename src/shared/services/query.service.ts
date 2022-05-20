import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QueryService {

    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>
    ) { }

    FindAdminByEmailOnly(email): any {
        return this.Admin.findOne({ where: { email } })
    }

    ApplyPaginationToQuery(query, filter, alias: string = null) {

        if ('offset' in filter && filter.offset) {
            query = query.offset(filter['offset'])
        }

        if ('limit' in filter && filter.limit) {
            query = query.limit(filter['limit'])
        }

        if ('order' in filter && filter.order) {
            Object.keys(filter.order).forEach(key => {
                if (key in filter.order) {
                    if (alias) {
                        query = query.orderBy(`${alias}.${key}`, filter.order[key])
                    } else {
                        query = query.orderBy(key, filter.order[key])
                    }
                }
            })
        }

        return query;
    }

    ApplySearchToQuery(query, filter, fields: Array<Array<string>> = []) {
        if ('search_query' in filter && filter.search_query) {
            query.andWhere(new Brackets(qry => {
                fields.forEach(field => {
                    const paramName = `${Math.round(Math.random() * 10000000000)}_${Date.now()}`
                    switch (field[1]) {
                        case "number":
                        case "text":
                        case "uuid":
                            qry = qry.orWhere(`(${field[0]})::text like (:${paramName})`, { [paramName]: `%${filter.search_query}%` })
                            break;
                        case "date":
                            qry = qry.orWhere(`(${field[0]})::text like (:${paramName})`, { [paramName]: `%${filter.search_query}%` })
                            break;
                        default:
                            break;
                    }
                })
            }))
        }
        return query;
    }

}
