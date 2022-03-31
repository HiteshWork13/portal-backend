import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filterOption } from 'src/models/db_operation.interface';
import { DeleteResult, EntitySchema, EntityTarget, FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class BaseOperationService<T> {

    constructor(private readonly genericRepository: Repository<T>) { }

    private _wrapSimpleQuery(conditions, select_fields: Array<T> = [], excluded_fields: Array<T> = []) {
        const query: filterOption = {}
        if (select_fields.length >= 0) {
            query['select'] = select_fields.reduce((result: any, field) => {
                result[field] = excluded_fields.indexOf(field) < 0;
                return result
            }, {})
        }
        if (conditions) {
            query['where'] = conditions
        }
        return query;
    }

    findAll(conditions: any, select_fields: Array<T> = [], excluded_fields: Array<T> = []): Promise<T[]> {
        try {
            return <Promise<T[]>>this.genericRepository.find(this._wrapSimpleQuery(conditions, select_fields, excluded_fields));
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    findOne(conditions: any, select_fields: Array<T> = [], excluded_fields: Array<T> = []): Promise<T> {
        try {
            return <Promise<T>>this.genericRepository.findOne(this._wrapSimpleQuery(conditions, select_fields, excluded_fields));
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    update(conditions: any, update_fields): Promise<UpdateResult> {
        try {
            return <Promise<UpdateResult>>this.genericRepository.update(conditions, update_fields);
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    delete(conditions: any): Promise<DeleteResult> {
        try {
            return <Promise<DeleteResult>>this.genericRepository.delete(this._wrapSimpleQuery(conditions));
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    query(query) {
        try {
            return <Promise<any>>this.genericRepository.find(query);
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    count(conditions: any): Promise<[T[], number]> {
        try {
            return <Promise<[T[], number]>>this.genericRepository.findAndCount({ where: conditions });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

}
