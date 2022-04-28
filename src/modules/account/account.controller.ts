import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { AccountCreatedResponse, AccountDeletedResponse, AccountUpdatedResponse, AccountUser, CreateAccount, CreateBy, UpdateAccountUser } from 'src/models/account.model';
import { AdminUser } from 'src/models/admin.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService, private queryService: QueryService, private utils: UtilsService) {

    }

    @ApiTags('Account')
    @ApiBody({ type: CreateAccount })
    @ApiResponse({ type: AccountCreatedResponse })
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
            const inserted: AccountUser = await this.accountService.createAccount(input);
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

    @ApiTags('Account')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAccountUser })
    @ApiResponse({ type: AccountUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateAccount/:id')
    async updateAccount(@Param('id') updateId, @Body() body: any, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateAccount body=${this.utils.beautify(body)} , param=${this.utils.beautify(updateId)}`);
            const toBeUpdateAccount = await this.accountService.findAccountById(updateId);
            const updated = await this.accountService.updateAccountQuery(updateId, body);
            logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
            delete toBeUpdateAccount['created_by']['password'];
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Updated SuccessFully",
                data: { ...toBeUpdateAccount, ...body }
            });
        } catch (error) {
            logger.log(level.error, `updateAccount Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: AccountDeletedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Delete('deleteAccount/:id')
    async deleteAccount(@Param('id') id: string, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteAccount body=${this.utils.beautify(req.body)} id=${id}`);
            const deleted = await this.accountService.deleteAccountQuery(id).execute();
            logger.log(level.info, `deleted: ${this.utils.beautify(deleted)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Deleted SuccessFully",
                data: deleted
            })
        } catch (error) {

            logger.log(level.error, `deleteAccount Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
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
            const accounts = await this.accountService.findAccountByCreatedId(filter);
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

    @ApiTags('Account')
    @ApiBody({ type: CreateBy, description: "created_by_id can be any Admin Id (Role: 2)" })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAccountsByAdminAndSubAdmin')
    async getAccountsByAdminAndSubAdmin(@Body() body: CreateBy,@Request() req, @Response() res) {
        try {
            logger.log(level.info, `getAccountsByAdminAndSubAdmin body=${this.utils.beautify(body)}`);
            const filter = {
                "created_by_id": body['created_by_id'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const accounts = await this.accountService.getAccountsByAdminAndSubAdmin(filter, currentAdmin);
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
