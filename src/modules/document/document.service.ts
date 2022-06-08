import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { level, logger } from 'src/config';
import { PODocumentsEntity } from 'src/entities/documents.entity';
import { Document } from 'src/models/document.model';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {

    constructor(
        @InjectRepository(PODocumentsEntity)
        private Document: Repository<PODocumentsEntity>,
        private utils: UtilsService,
        private queryService: QueryService
    ) {

    }

    FindDocumentById(id) {
        return this.Document.findOne({ where: { id } });
    }

    FindDocumentForAccount = (filter) => {
        var query = this.Document.createQueryBuilder()
            .leftJoinAndSelect('document.uploaded_by', 'admin')
            .leftJoinAndSelect('document.upload_for_account', 'account')
            .select()
            .where('uploaded_by_id = :uploaded_by_id', { uploaded_by_id: filter['uploaded_by_id'] })

        if ('upload_for_account_id' in filter && filter.upload_for_account_id) {
            query = query.andWhere('upload_for_account_id = :upload_for_account_id', { upload_for_account_id: filter['upload_for_account_id'] })
        }

        return query;
    }

    FindDocumentsByAccountId(filter) {
        var query = this.Document.createQueryBuilder('document')
            .leftJoinAndSelect('document.uploaded_by', 'admin')
            .leftJoinAndSelect('document.upload_for_account', 'account')
            .select()
            .where('document.upload_for_account_id = :upload_for_account_id', { upload_for_account_id: filter.account_id });
        query = this.queryService.ApplyPaginationToQuery(query, filter, 'document');
        return query;
    }

    async createDocument(inputData): Promise<Document> {
        try {
            logger.log(level.info, `createDocument body=${this.utils.beautify(inputData)}`);
            const doc: any = this.Document.create(inputData)
            await this.Document.save(doc);
            var query: any = this.Document.createQueryBuilder('document')
                .leftJoinAndSelect('document.uploaded_by', 'admin')

            if ('upload_for_account_id' in inputData) {
                query = query.leftJoinAndSelect('document.upload_for_account', 'account');
            }

            query = query.where('document.id = :doc_id', { doc_id: doc.id }).getOne();
            return query;
        } catch (error) {
            throw error
        }
    }

    updateDocument(id, body) {
        return this.Document.update({ id }, body);
    }

    deleteDocument(id) {
        return this.Document.delete({ id })
    }


}
