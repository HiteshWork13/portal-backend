import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JWT_CONST } from 'src/constants';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser } from 'src/models/admin.interface';
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
            throw new UnauthorizedException();
        }
        return user;
    }

    login(user: AdminUser) {
        const payload = { ...user };
        delete payload.password;
        const response = { ...user }
        response['access_token'] = this.jwtService.sign(payload)
        delete response.password;
        return response;
    }
}
