import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsEntity } from 'src/entities/documents.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentsEntity]),
    SharedModule,
    forwardRef(() => AccountModule)
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule { }
