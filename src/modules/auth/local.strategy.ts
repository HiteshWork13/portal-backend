import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { level, logger } from 'src/config';
import { UtilsService } from 'src/shared/services/utils.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, private utils: UtilsService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        let user: any = await this.authService.validateEmailAndPassword(username, password);
        logger.log(level.info, `AdminDoc: ${this.utils.beautify(user)}`)
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}