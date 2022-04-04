import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { level, logger } from 'src/config';
import { UtilsService } from 'src/shared/services/utils.service';
import { ERROR_CONST } from 'src/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private utils: UtilsService) {
        super({ usernameField: "email" });
    }

    async validate(email: string, password: string): Promise<any> {
        let user: any = await this.authService.validateEmailAndPassword(email, password);
        logger.log(level.info, `AdminDoc: ${this.utils.beautify(user)}`)
        if (!user) {
            throw new UnauthorizedException({
                success: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                message: ERROR_CONST.USER_NOT_AUTHORIZED,
                data: {}
            })
        }
        return user;
    }
}