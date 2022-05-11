import { Controller, Get, HttpStatus, Param, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from '../account/account.service';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {

    constructor(private documentService: DocumentService, private accountService: AccountService, private utils: UtilsService) {

    }

    @ApiTags('Document')
    @ApiBody({ description: "Docid Can be Account Id or Document Id "})
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
                const account = await this.accountService.findAccountById(docId);
                if (account && 'document' in account && account['document']) {
                    const file = createReadStream(join(file_location, account['document'].document_name));
                    file.pipe(res);
                } else if (account) {
                    const document = await this.documentService.FindDocumentByAccountId(account.id);
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
                } else {
                    return this.utils.sendJSONResponse(res, HttpStatus.NOT_FOUND, {
                        success: false,
                        message: ERROR_CONST.FILE_NOT_FOUND,
                        data: null
                    });
                }
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

}
