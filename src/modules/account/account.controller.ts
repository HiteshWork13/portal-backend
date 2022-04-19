import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AccountUser, CreateAccount, CreateBy } from 'src/models/account.model';
import { AdminUser } from 'src/models/admin.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AdminService } from '../admin/admin.service';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService, private queryService: QueryService, private utils: UtilsService) {

    }

    @ApiBody({ type: CreateAccount })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('createAccount')
    async createAccount(@Body() body: CreateAccount, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createAccount body=${this.utils.beautify(body)}`);
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const input: CreateAccount = body;
            input.created_by_id = currentAdmin['id'];
            const inserted: AccountUser = await this.accountService.CreateAccount(input);
            delete inserted.password;
            delete inserted['created_by']['password'];
            logger.log(level.info, `New Account Created : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Account Created Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `createAccount Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({ type: CreateBy, description: "created_by_id can be any ID" })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAllAccountsByCreatedId')
    async getAllAccountsByCreatedId(@Body() body: CreateBy, @Response() res) {
        try {
            logger.log(level.info, `getAllAccountsByCreatedId body=${this.utils.beautify(body)}`);
            const filter = {
                "created_by_id": body['created_by_id'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const accounts = await this.accountService.FindAccountByCreatedId(filter);
            logger.log(level.info, `Account List: ${this.utils.beautify(accounts)}`);
            accounts.map(account => delete account['password']);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Fetched SuccessFully",
                data: accounts
            })

        } catch (error) {
            logger.log(level.error, `getAllAccountsByCreatedId Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({ type: CreateBy, description: "created_by_id can be any Admin Id (Role: 2)" })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAccountsByAdminAndSubAdmin')
    async getAccountsByAdminAndSubAdmin(@Body() body: CreateBy, @Response() res) {
        try {
            logger.log(level.info, `getAccountsByAdminAndSubAdmin body=${this.utils.beautify(body)}`);
            const filter = {
                "created_by_id": body['created_by_id'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const accounts = await this.accountService.getAccountsByAdminAndSubAdmin(filter);
            logger.log(level.info, `Account List: ${this.utils.beautify(accounts)}`);
            accounts.map(account => delete account['created_by']['password']);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Fetched SuccessFully",
                data: accounts
            })

        } catch (error) {
            logger.log(level.error, `getAccountsByAdminAndSubAdmin Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
