import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryExportDrEntity } from 'src/entities/history_export_dr.entity';
import { SharedModule } from 'src/shared/shared.module';
import { HistoryExportDrController } from './history-export-dr.controller';
import { HistoryExportDrService } from './history-export-dr.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([HistoryExportDrEntity]),
        SharedModule
      ],
    controllers: [HistoryExportDrController],
    providers: [HistoryExportDrService],
    exports : [HistoryExportDrService]
})
export class HistoryExportDrModule {}
