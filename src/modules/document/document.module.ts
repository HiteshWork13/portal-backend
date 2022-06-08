import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PODocumentsEntity } from 'src/entities/documents.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccountModule } from '../account/account.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    TypeOrmModule.forFeature([PODocumentsEntity]),
    SharedModule,
    NestjsFormDataModule,
    forwardRef(() => AccountModule)
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule { }
