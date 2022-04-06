import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';
import { UtilsService } from './services/utils.service';
import { IsInNestedRule } from './validators/is-in-nested.validator';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_ADMIN_TOKEN_SECRET
        }),
    ],
    providers: [JwtService, UtilsService, IsInNestedRule],
    exports: [JwtService, UtilsService, JwtModule]
})
export class SharedModule { }
