import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APP_CONST } from 'src/constants';
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

    async createAccount(inputData): Promise<AccountUser> {
        try {
            console.log("create account", inputData);
            const user: any = this.Account.create(inputData)
            await this.Account.save(user);
            var account: any = this.Account.createQueryBuilder('account')
                .leftJoinAndSelect('account.created_by', 'admin')
                .where('account.id = :account_id', { account_id: user.id }).getOne()
            return account;
        } catch (error) {
            throw error
        }
    }

    findAccountByCreatedId = (filter) => {
        var query = this.Account.createQueryBuilder('account')
            .leftJoinAndSelect('account.created_by', 'admin');

        if ('created_by_id' in filter && filter.created_by_id) {
            query = query.where('account.created_by_id = :created_by_id', { created_by_id: filter['created_by_id'] })
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

        return query.getMany();
    }

    getAccountsByAdminAndSubAdmin = (filter) => {
        var query = this.Account.createQueryBuilder('account');

        query.leftJoinAndSelect('account.created_by', 'admin');

        if ('created_by_id' in filter && filter.created_by_id) {
            query = query.where('account.created_by_id = :adminId', { adminId: filter['created_by_id'] })
            query = query.orWhere('account.created_by_id IN ' +
                query.subQuery()
                    .select("subAdmin.id")
                    .from(AdminEntity, "subAdmin")
                    .where("subAdmin.role = :role", { role: APP_CONST.SUB_ADMIN_ROLE })
                    .andWhere("subAdmin.created_by_id = :adminId", { adminId: filter['created_by_id'] })
                    .getQuery())
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

        // query : select * from account where account.created_by == adminId or account.created_by in [sub admin's id <get sub admin ids via sub query>]
        return query.getMany();

    }

    findAccountById(id) {
        return this.Account.createQueryBuilder('account')
            .leftJoinAndSelect('account.created_by', 'admin')
            .where("account.id = :accountId", { accountId: id }).getOne();
        // return this.Account.findOne({ where: { id } });
    }

    updateAccountQuery(id, body) {
        return this.Account.update({ id }, body)
    }

    deleteAccountQuery(id) {
        return this.Account.createQueryBuilder()
            .delete()
            .from('Account')
            .where('id = :id', { id })
    }
}
