import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';
import { UtilsService } from './services/utils.service';
import { BaseOperationService } from './services/base-operation.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_ADMIN_TOKEN_SECRET
        }),
    ],
    providers: [JwtService, UtilsService, BaseOperationService],
    exports: [JwtService, UtilsService, JwtModule, BaseOperationService]
})
export class SharedModule { }
