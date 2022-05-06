import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import { DocumentsEntity } from 'src/entities/documents.entity';
import { Document } from 'src/models/document.model';
import { UtilsService } from 'src/shared/services/utils.service';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {

    constructor(
        @InjectRepository(DocumentsEntity)
        private Document: Repository<DocumentsEntity>,
        private utils: UtilsService
    ) {

    }

    async createDocument(inputData): Promise<Document> {
        try {
            logger.log(level.info, `createDocument body=${this.utils.beautify(inputData)}`);
            const doc: any = this.Document.create(inputData)
            await this.Document.save(doc);
            var query: any = this.Document.createQueryBuilder('document')
                .leftJoinAndSelect('document.uploaded_by', 'admin');

            if ('upload_for_account_id' in inputData) {
                query = query.leftJoinAndSelect('document.upload_for_account', 'account');
            }
            if ('upload_for_admin_id' in inputData) {
                query = query.leftJoinAndSelect('document.upload_for_admin', 'admin');
            }
            query = query.where('document.id = :doc_id', { doc_id: doc.id }).getOne();
            return query;
        } catch (error) {
            throw error
        }
    }

}
