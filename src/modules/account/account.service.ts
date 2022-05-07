import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AccountEntity } from 'src/entities/account.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { AccountUser, CreateAccount } from 'src/models/account.model';
import { AdminUser } from 'src/models/admin.model';
import { UtilsService } from 'src/shared/services/utils.service';
import { Admin, Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>,
        private utils: UtilsService
    ) {

    }

    async createAccount(inputData): Promise<AccountUser> {
        try {
            logger.log(level.info, `create account: ${this.utils.beautify(inputData)}`);
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

    getAccountsByAdminAndSubAdmin = async (filter, currentAdmin: AdminUser = null) => {
        var hirarchy = {
            [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
            [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
        }
        var query = this.Account.createQueryBuilder('account');
        query.leftJoinAndSelect('account.created_by', 'admin');


        if ('created_by_id' in filter && filter.created_by_id) {
            const admin = await query.subQuery().select("a.role").from(AdminEntity, 'a').where("a.id = :id", { id: filter.created_by_id }).getOne();
            if (admin && admin['role']) {
                if (admin['role'] in hirarchy) {
                    const level = hirarchy[admin['role']];
                    query = query.where('account.created_by_id = :adminId', { adminId: filter['created_by_id'] });
                    var parentIds = [filter['created_by_id']];
                    for (var i = 0; i < level.length; i++) {
                        const roleId = level[i];
                        /* Create Random Variable Name for query. Because if paramname keep same in orWhere(). then it will overwrite last orwhere parameters so. */
                        const paramName = `${Math.random()}_${Date.now()}`
                        if (parentIds.length > 0) {
                            var nextLevelAdmin = await query.subQuery()
                                .select("adm.id")
                                .from(AdminEntity, "adm")
                                .where("adm.role = :role", { role: roleId })
                                .andWhere(`"adm"."created_by_id" IN (:...${paramName})`, { [paramName]: [...parentIds] })
                                .getMany();
                            parentIds = [...nextLevelAdmin.map(item => { return item.id })];
                            if (parentIds.length > 0) {
                                query = query.orWhere(`"account"."created_by_id" IN (:...${paramName})`, { [paramName]: [...parentIds] })
                            }
                        }
                    }
                } else if (admin['role'] == APP_CONST.SUB_ADMIN_ROLE) {
                    // might be Sub admin Role
                    if (currentAdmin && filter.created_by_id == currentAdmin.id) {
                        const currentSubAdminPermissions: any = await query.subQuery().select("a.permissions").from(AdminEntity, 'a').where("a.id = :id", { id: filter['created_by_id'] }).getOne();
                        logger.log(level.info, `currentSubAdmin: ${currentSubAdminPermissions}`);
                        query = query.where('account.created_by_id = :adminId', { adminId: filter['created_by_id'] });

                        if (currentSubAdminPermissions) {
                            const accountList = currentSubAdminPermissions?.permissions?.viewAccounts || [];
                            if (accountList.length > 0) {
                                query = query.orWhere(`"account"."created_by_id" IN (:...viewAccounts)`, { viewAccounts: [...accountList] })
                            }
                        }
                    } else {
                        query = query.where('account.created_by_id = :adminId', { adminId: filter['created_by_id'] });
                    }
                }
            } else {
                // Unknown Id for created_by
                query = query.where('account.created_by_id = :adminId', { adminId: filter['created_by_id'] });
            }
        }

        const count = await query.getCount();
        const result = { count };

        if ('offset' in filter && filter.offset) {
            query = query.offset(filter['offset']);
            result['offset'] = filter['offset'];
        }

        if ('limit' in filter && filter.limit) {
            query = query.limit(filter['limit']);
            result['limit'] = filter.limit;
        }

        if ('order' in filter && filter.order) {
            Object.keys(filter.order).forEach(key => {
                if (key in filter.order) {
                    query = query.orderBy(key, filter.order[key])
                }
            })
        }

        // query : select * from account where account.created_by == adminId or account.created_by in [sub admin's id <get sub admin ids via sub query>]
        const data = await query.getMany();
        result['data'] = data;

        return result;


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
