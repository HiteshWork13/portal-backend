import { Body, Controller, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { ERROR_CONST, JWT_CONST } from 'src/constants';
import { AdminLogin, NewAdminUser } from 'src/models/admin.interface';
import { JwtService } from 'src/shared/services/jwt.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private utils: UtilsService) {

    }

    @ApiBody({
        description: `
        body: {
            username: String
            password: String
        }
    `})
    @UseGuards(AuthGuard('local'))
    @Post('adminLogin')
    async adminLogin(@Body() body: AdminLogin, @Request() req, @Response() res) {
        try {
            const data = await this.authService.login(req.user)
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Login Successfully",
                data
            });
        } catch (error) {
            logger.log(level.error, `adminLogin Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }
}
