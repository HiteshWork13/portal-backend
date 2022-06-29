import { forwardRef, Module } from '@nestjs/common';
import { HistoryExportService } from './history-export.service';
import { HistoryExportController } from './history-export.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryExportEntity } from 'src/entities/history_export.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccountModule } from '../account/account.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AccountEntity } from 'src/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryExportEntity, AccountEntity]),
    SharedModule,
    NestjsFormDataModule,
    forwardRef(() => AccountModule)
  ],
  controllers: [HistoryExportController],
  providers: [HistoryExportService],
  exports: [HistoryExportService]
})
export class HistoryExportModule { }
