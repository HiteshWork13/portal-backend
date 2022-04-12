import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { JwtService } from './services/jwt.service';
import { QueryService } from './services/query.service';
import { UtilsService } from './services/utils.service';
import { IsInNestedRule } from './validators/is-in-nested.validator';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_ADMIN_TOKEN_SECRET
        }),
        TypeOrmModule.forFeature([AdminEntity])
    ],
    providers: [JwtService, UtilsService, QueryService, IsInNestedRule],
    exports: [JwtService, UtilsService, QueryService, JwtModule]
})
export class SharedModule { }
