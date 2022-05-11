import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/entities/account.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { NestjsFormDataModule, MemoryStoredFile } from "nestjs-form-data/dist";
import { DocumentModule } from '../document/document.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    SharedModule,
    forwardRef(() => DocumentModule),
    NestjsFormDataModule.config({ storage: MemoryStoredFile, fileSystemStoragePath: './po_files' }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
