import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { CreateAccount } from 'src/models/account.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService, private utils: UtilsService) {

    }

    @ApiBody({ type: CreateAccount })
    @UseGuards(JwtAuthGuard)
    @Post('createAccount')
    async createAccount(@Body() body: CreateAccount, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createAccount body=${this.utils.beautify(body)}`);


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
