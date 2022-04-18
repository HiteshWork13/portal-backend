import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { AccountUser } from 'src/models/account.model';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>
    ) {

    }

    async CreateAccount(inputData): Promise<AccountUser> {
        try {
            console.log("create account", inputData);
            const user: any = this.Account.create(inputData)
            await this.Account.save(user);
            return user
        } catch (error) {
            throw error
        }
    }
    
    FindAccountByCreatedId = (filter) => {
        var query = this.Account.createQueryBuilder().select("*")
            // .leftJoinAndSelect('account.created_by', 'admin');

        if ('created_by' in filter && filter.created_by) {
            query = query.where('created_by = :created_by', { created_by: filter['created_by'] })
        }

        if ('offset' in filter && filter.offset) {
            query = query.offset(filter['offset'])
        }

        if ('limit' in filter && filter.limit) {
            query = query.limit(filter['limit'])
        }

        if ('order' in filter && filter.order) {
            Object.keys(filter.order).forEach(key => {
                if (key in filter.order) {
                    query = query.orderBy(key, filter.order[key])
                }
            })
        }

        return query;
    }

    GetAccounts = (filter) => {
        var query = this.Account.createQueryBuilder().select("id, firstname")
            // .leftJoinAndSelect('account.created_by', 'admin');

        if ('created_by' in filter && filter.created_by) {
            query = query.where('created_by = :created_by', { created_by: filter['created_by'] })
        }

        if ('offset' in filter && filter.offset) {
            query = query.offset(filter['offset'])
        }

        if ('limit' in filter && filter.limit) {
            query = query.limit(filter['limit'])
        }

        if ('order' in filter && filter.order) {
            Object.keys(filter.order).forEach(key => {
                if (key in filter.order) {
                    query = query.orderBy(key, filter.order[key])
                }
            })
        }

        return query.execute();
    }
}
