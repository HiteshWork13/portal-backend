import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AccountUser, CreateAccount } from 'src/models/account.model';
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
    @UseGuards(JwtAuthGuard)
    @Post('createAccount')
    async createAccount(@Body() body: CreateAccount, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createAccount body=${this.utils.beautify(body)}`);
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const input: CreateAccount = body;
            input.created_by = currentAdmin['id'];
            const inserted: AccountUser = await this.accountService.CreateAccount(input);
            delete inserted.password;
            logger.log(level.info, `New Account Created : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Account Created Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `createAccount Error=error`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
