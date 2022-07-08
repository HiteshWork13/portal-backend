import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CONST, JWT_CONST } from 'src/constants';
import { AccountEntity } from 'src/entities/account.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser } from 'src/models/admin.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>,
        @InjectRepository(AccountEntity)
        private Account: Repository<AccountEntity>,
        private jwtService: JwtService
    ) { }

    async validateEmailAndPassword(email, password) {
        const user = await this.Admin.findOne({
            where: { email, status: (<0 | 1>JWT_CONST.admin_constants.ADMIN_USER_ACTIVE) }
        })
        if (!(await user?.validatePassword(password))) {
            const account = await this.Account.findOne({
                where: { email, login: true }
            })
            if (!(await account?.validatePassword(password))) {
                throw new UnauthorizedException({
                    success: false,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: ERROR_CONST.USER_NOT_AUTHORIZED,
                    data: {}
                })
            } else {
                account['isUserLogin'] = true;
                return account;
            }
        }
        return user;
    }

    login(user: AdminUser): AdminUser {
        const response = { ...user }
        delete response.password;
        response['access_token'] = this.jwtService.sign(response)
        return response;
    }
}
