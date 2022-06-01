import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AccountEntity } from 'src/entities/account.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { AccountUser, CreateAccount } from 'src/models/account.model';
import { AdminUser } from 'src/models/admin.model';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Admin, Brackets, Repository } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>,
        private utils: UtilsService,
        private queryService: QueryService
    ) {

    }

    async createAccount(inputData): Promise<AccountUser> {
        try {
            logger.log(level.info, `create account: ${this.utils.beautify(inputData)}`);
            const user: any = this.Account.create(inputData)
            await this.Account.save(user);
            var account: any = this.Account.createQueryBuilder('account')
                .leftJoinAndSelect('account.created_by_id', 'admin')
                // .leftJoinAndSelect('account.document', 'documents')
                .where('account.id = :account_id', { account_id: user.id }).getOne()
            return account;
        } catch (error) {
            throw error
        }
    }

    findAccountByCreatedId = (filter) => {
        var query = this.Account.createQueryBuilder('account')
            .leftJoinAndSelect('account.created_by_id', 'admin')
        // .leftJoinAndSelect('account.document', 'documents');

        if ('created_by_id' in filter && filter.created_by_id) {
            query = query.where('account.created_by = :created_by', { created_by: filter['created_by_id'] })
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
        const searchFields = {
            'account.id': 'uuid',
            // 'account.code': 'text',
            'account.firstname': 'text',
            "account.lastname": 'text',
            "account.companyname": 'text',
            // "account.phone": 'text',
            // "account.address": 'text',
            // "account.postcode": 'text',
            "account.country": 'text',
            // "account.billingemail": 'text',
            // "account.customerid": 'text',
            // "account.vat": 'text',
            // "account.packageid": 'number',
            // "account.accounttype": 'number',
            // "account.credits": 'number',
            "account.email": 'text',
            // "account.verificationtoken": 'text',
            // "account.city": 'text',
            // "account.triallimit": 'number',
            // "account.role": 'number',
            // "account.totaldevices": 'number',
            // "account.payid": 'number',
            // "account.registrationtype": 'number',
            "account.created_by": 'uuid',
            // "account.enduser_street": 'text',
            // "account.enduser_state": 'text',
            "account.enduser_email": 'text',
            "account.reseller_company": 'text',
            // "account.reseller_street": 'text',
            // "account.reseller_state": 'text',
            // "account.reseller_code": 'text',
            "account.reseller_firstname": 'text',
            "account.reseller_lastname": 'text',
            // "account.enduser_classification": 'text',
            "account.reseller_email": 'text',
            // "account.packageid_dr": 'number',
            // "account.size_dr": 'number',
            // "account.totaldevices_dr": 'number',
            "admin.firstname": 'text'
        }
        var hirarchy = {
            [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
            [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
        }
        var query = this.Account.createQueryBuilder('account');
        query.leftJoinAndSelect('account.created_by_id', 'admin');
        // query.leftJoinAndSelect('account.document', 'documents');

        if ('created_by_id' in filter && filter.created_by_id) {
            const admin = await query.subQuery().select("a.role").from(AdminEntity, 'a').where("a.id = :id", { id: filter.created_by_id }).getOne();
            if (admin && admin['role']) {
                if (admin['role'] in hirarchy) {
                    const level = hirarchy[admin['role']];
                    var parentIds = [filter['created_by_id']];
                    var idList = [];
                    for (var i = 0; i < level.length; i++) {
                        const roleId = level[i];
                        if (parentIds.length > 0) {
                            var nextLevelAdmin = await this._getIds(query, roleId, parentIds);
                            parentIds = [...nextLevelAdmin.map(item => { return item.id })];
                            if (parentIds.length > 0) {
                                idList = [...idList, ...parentIds];
                            }
                        }
                    }

                    query = await query.where(new Brackets(async (qry) => {
                        qry = qry.where('account.created_by = :adminId', { adminId: filter['created_by_id'] });
                        if (admin['role'] == APP_CONST.SUPER_ADMIN_ROLE) {
                            qry = qry.orWhere('"account"."created_by" IS NULL');
                        }
                        if (idList.length > 0) {
                            qry = qry.orWhere(`"account"."created_by" IN (:...subLevelAdminIds)`, { subLevelAdminIds: [...idList] })
                        }
                    }));
                } else if (admin['role'] == APP_CONST.SUB_ADMIN_ROLE) {
                    // Might be Sub admin Role
                    if (currentAdmin && filter.created_by_id == currentAdmin.id) {
                        const currentSubAdminPermissions: any = await query.subQuery().select("a.permissions").from(AdminEntity, 'a').where("a.id = :id", { id: filter['created_by_id'] }).getOne();
                        logger.log(level.info, `currentSubAdmin: ${currentSubAdminPermissions}`);
                        query = query.where(new Brackets(async (qry) => {
                            qry = qry.where('account.created_by = :adminId', { adminId: filter['created_by_id'] });
                            if (currentSubAdminPermissions) {
                                const accountList = currentSubAdminPermissions?.permissions?.viewAccounts || [];
                                if (accountList.length > 0) {
                                    qry = qry.orWhere(`"account"."created_by" IN (:...viewAccounts)`, { viewAccounts: [...accountList] })
                                }
                            }
                        }));
                    } else {
                        query = query.where(new Brackets(async (qry) => {
                            qry = qry.where('account.created_by = :adminId', { adminId: filter['created_by_id'] });
                        }));
                    }
                }
            } else {
                // Unknown Id for created_by
                query = query.where(new Brackets(async (qry) => {
                    qry = qry.where('account.created_by = :adminId', { adminId: filter['created_by_id'] });
                }));
            }
        }

        query = await this.queryService.ApplySearchToQuery(query, filter, Object.entries(searchFields));

        const count = await query.getCount();
        const result = { count };

        query = await this.queryService.ApplyPaginationToQuery(query, filter, 'account');
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

    async _getIds(query, roleId, parentIds) {
        const paramName = `${Math.random()}_${Date.now()}`
        return await query.subQuery()
            .select("adm.id")
            .from(AdminEntity, "adm")
            .where("adm.role = :role", { role: roleId })
            .andWhere(`"adm"."created_by" IN (:...${paramName})`, { [paramName]: [...parentIds] })
            .getMany();
    }

    findAccountById(id) {
        return this.Account.createQueryBuilder('account')
            .leftJoinAndSelect('account.created_by_id', 'admin')
            // .leftJoinAndSelect('account.document', 'documents')
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
