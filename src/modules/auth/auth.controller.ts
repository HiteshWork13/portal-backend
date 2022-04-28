import { Body, Controller, HttpStatus, Post, Request, Response, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { Login, LoginResponse } from 'src/models/admin.model';
import { UtilsService } from 'src/shared/services/utils.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private utils: UtilsService) {

    }

    @ApiTags('Authentication')
    @ApiBody({ type: Login })
    @ApiResponse({ type: LoginResponse })
    @UseGuards(AuthGuard('local'))
    @Post('adminLogin')
    async adminLogin(@Body() body: Login, @Request() req, @Response() res) {
        try {
            const data = await this.authService.login(req.user);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Login Successfully",
                data
            });
        } catch (error) {
            logger.log(level.error, `adminLogin Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }
}
