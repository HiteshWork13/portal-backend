import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { getAllDocumentReq, getAllDocumentRes } from 'src/models/document.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from '../account/account.service';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {

    constructor(private documentService: DocumentService, private accountService: AccountService, private utils: UtilsService) {

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

}
