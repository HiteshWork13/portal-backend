import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsEntity } from 'src/entities/documents.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentsEntity]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule { }
