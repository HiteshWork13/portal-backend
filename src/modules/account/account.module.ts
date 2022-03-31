import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    SharedModule
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
