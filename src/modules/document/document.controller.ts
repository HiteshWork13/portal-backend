import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import path, { join } from 'path';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { AdminUser } from 'src/models/admin.model';
import { getAllDocumentReq, getAllDocumentRes, PO_File_DTO, uploadDocumentReq } from 'src/models/document.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from '../account/account.service';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {

    constructor(private documentService: DocumentService, private accountService: AccountService, private utils: UtilsService, private queryService: QueryService, private uploadService: FileUploadService) {

    }

    @ApiTags('Document')
    @ApiBody({ description: "Docid Can be Document Id " })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: false }))
    @Get('downloadDocument/:docId')
    async downloadDocument(@Param('docId') docId: string, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `downloadDocument doc id=${docId}`);
            const document = await this.documentService.FindDocumentById(docId);
            const file_location = join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH);
            if (document) {
                const file = createReadStream(join(file_location, document.document_name));
                file.pipe(res);
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.NOT_FOUND, {
                    success: false,
                    message: ERROR_CONST.FILE_NOT_FOUND,
                    data: null
                });
            }

        } catch (error) {
            logger.log(level.error, `downloadDocument Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Document')
    @ApiBody({ type: getAllDocumentReq })
    @ApiResponse({ type: getAllDocumentRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: false }))
    @Post('getAllDocuments')
    async getAllDocuments(@Body() body: getAllDocumentReq, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `getAllDocuments account_id=${this.utils.beautify(body)}`);
            const filter = {
                "account_id": body.account_id,
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const [document, count] = await this.documentService.FindDocumentsByAccountId(filter).getManyAndCount();
            console.log('document: ', document);
            const response = {
                success: true,
                message: "Document Fetched Successfully.",
                data: document,
                count: count
            }
            'limit' in body ? response['limit'] = body['limit'] : null;
            'offset' in body ? response['offset'] = body['offset'] : null;
            return this.utils.sendJSONResponse(res, HttpStatus.OK, response);
        } catch (error) {
            logger.log(level.error, `getAllDocuments Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Document')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: uploadDocumentReq })
    @ApiResponse({ type: getAllDocumentRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('uploadDocument')
    @FormDataRequest({ storage: MemoryStoredFile })
    async uploadDocument(@Body() body: uploadDocumentReq, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `uploadDocument account_id=${body.account_id}`);
            const filter = {
                "account_id": body.account_id
            }
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);


            var uploadedFile;

            if ('file' in body && body.file && body.file != null && body.file != undefined) {
                const po_error = await this.utils.validateDTO(PO_File_DTO, body);
                logger.log(level.info, `Validation Errors: ${po_error}`);
                if (po_error.length > 0) {
                    return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                        success: false,
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: po_error,
                        error: ERROR_CONST.BAD_REQUEST
                    });
                }
                uploadedFile = await this.uploadService.uploadFileToDest(path.join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH), body.file);
                const document = {
                    uploaded_by_id: currentAdmin.id,
                    upload_for_account_id: body.account_id,
                    document_name: uploadedFile.name
                }
                const newDocument = await this.documentService.createDocument(document);
                logger.log(level.info, `New Document Inserted:${this.utils.beautify(newDocument)}`);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Document Uploaded Successfully",
                    data: newDocument
                });
            } else {

                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: true,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Document Uploaded Failed",
                    data: null
                });
            }
        } catch (error) {
            logger.log(level.error, `uploadDocument Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
