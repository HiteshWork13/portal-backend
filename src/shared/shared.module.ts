import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { FileUploadService } from './services/file-upload.service';
import { JwtService } from './services/jwt.service';
import { QueryService } from './services/query.service';
import { UtilsService } from './services/utils.service';
import { IsInNestedRule } from './validators/is-in-nested.validator';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_ADMIN_TOKEN_SECRET
        }),
        TypeOrmModule.forFeature([AdminEntity]),
        HttpModule
    ],
    providers: [JwtService, UtilsService, QueryService, FileUploadService, IsInNestedRule],
    exports: [JwtService, UtilsService, QueryService, FileUploadService, JwtModule, HttpModule]
})
export class SharedModule { }
