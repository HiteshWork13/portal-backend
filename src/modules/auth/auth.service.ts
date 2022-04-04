import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CONST, JWT_CONST } from 'src/constants';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser } from 'src/models/admin.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AdminEntity)
        private Admin: Repository<AdminEntity>,
        private jwtService: JwtService
    ) { }

    async validateEmailAndPassword(email, password) {
        const user = await this.Admin.findOne({
            where: { email, status: (<0 | 1>JWT_CONST.admin_constants.ADMIN_USER_ACTIVE) }
        })
        if (!(await user?.validatePassword(password))) {
            throw new UnauthorizedException({
                success: false,
                statusCode: HttpStatus.UNAUTHORIZED,
                message: ERROR_CONST.USER_NOT_AUTHORIZED,
                data: {}
            })
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
