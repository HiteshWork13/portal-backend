import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, Response, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AccountCreatedResponse, AccountDeletedResponse, AccountUpdatedResponse, AccountUser, CreateAccount, CreateAccountReq, CreateAccountReqDoc, CreateBy, UpdateAccountReq, UpdateAccountReqDoc, UpdateAccountUser } from 'src/models/account.model';
import { AdminUser } from 'src/models/admin.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AccountService } from './account.service';
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { DocumentService } from '../document/document.service';
import path from 'path';

@Controller('account')
export class AccountController {

    constructor(private accountService: AccountService, private documentService: DocumentService, private queryService: QueryService, private utils: UtilsService, private uploadService: FileUploadService) {

    }

    @ApiTags('Account')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateAccountReqDoc, description: "Value of Data : Check `CreateAccountReqDoc` In The Schema Section Under This Documentation" })
    @ApiResponse({ type: AccountCreatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('createAccount')
    @FormDataRequest({ storage: MemoryStoredFile })
    async createAccount(@Body() body: CreateAccountReq, @Request() req, @Response() res) {
        try {
            const payload = <CreateAccount>JSON.parse(body.data);
            logger.log(level.info, `createAccount body=${this.utils.beautify(payload)}`);

            const body_error = await this.utils.validateDTO(CreateAccount, payload)
            logger.log(level.info, `Validation : ${body_error}`);

            if (body_error.length > 0) {
                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: body_error,
                    error: ERROR_CONST.BAD_REQUEST
                });
            }

            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);

            if ((currentAdmin.role == APP_CONST.ADMIN_ROLE || currentAdmin.role == APP_CONST.SUB_ADMIN_ROLE) && (!('file' in body) || !body?.file)) {
                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: [ERROR_CONST.PO_FILE_MISSING],
                    error: ERROR_CONST.BAD_REQUEST
                });
            }

            var uploadedFile;

            if ('file' in body && body.file && body.file != null && body.file != undefined) {
                const po_error = await this.utils.validateDTO(CreateAccountReq, body);
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
                if(!uploadedFile) {
                    return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                        success: false,
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: po_error,
                        error: ERROR_CONST.INTERNAL_SERVER_ERROR
                    });
                }
            }

            const input: CreateAccount = payload;
            input.created_by = currentAdmin['id'];
            const inserted: AccountUser = await this.accountService.createAccount(input);
            delete inserted.password;
            delete inserted['created_by_id']['password'];
            logger.log(level.info, `New Account Created : ${this.utils.beautify(inserted)}`);

            if (uploadedFile) {
                const document = {
                    uploaded_by_id: currentAdmin.id,
                    upload_for_account_id: inserted.id,
                    document_name: uploadedFile.name
                }
                const newDocument = await this.documentService.createDocument(document);
                logger.log(level.info, `New Document Inserted:${this.utils.beautify(newDocument)}`);
                inserted['document'] = newDocument;
            } else {
                
            }

            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Account Created Successfully",
                data: inserted
            });

        } catch (error) {
            logger.log(level.error, `createAccount Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAccountReqDoc, description: "Value of Data : Check `UpdateAccountReqDoc` In The Schema Section Under This Documentation" })
    @ApiResponse({ type: AccountUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateAccount/:id')
    @FormDataRequest({ storage: MemoryStoredFile })
    async updateAccount(@Param('id') updateId, @Body() body: any, @Request() req, @Response() res) {
        try {

            const payload = <UpdateAccountUser>JSON.parse(body.data);
            logger.log(level.info, `updateAccount body=${this.utils.beautify(payload)} , param=${this.utils.beautify(updateId)}`);

            const body_error = await this.utils.validateDTO(UpdateAccountUser, payload)
            logger.log(level.info, `Validation : ${body_error}`);

            if (body_error.length > 0) {
                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: body_error,
                    error: ERROR_CONST.BAD_REQUEST
                });
            }

            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);

            var uploadedFile;

            /* if ('file' in body && body?.file && body?.file != null && body?.file != undefined) {
                const po_error = await this.utils.validateDTO(UpdateAccountReq, body);
                logger.log(level.info, `Validation Errors: ${po_error}`);
                if (po_error.length > 0) {
                    return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                        success: false,
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: po_error,
                        error: ERROR_CONST.BAD_REQUEST
                    });
                }

                const filter = { uploaded_by_id: currentAdmin.id, upload_for_account_id: updateId };
                const document = await this.documentService.FindDocumentForAccount(filter).getOne();
                logger.log(level.info, `Document Found:${this.utils.beautify(document)}`);
                if (document) {
                    // Update Document File.
                    this.uploadService.deleteFileFromDest(path.join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH, document.document_name)).then(async (result) => {
                        uploadedFile = await this.uploadService.uploadFileToDest(path.join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH), body.file);
                        const docBody = {
                            document_name: uploadedFile.name
                        }
                        const newDocument = await this.documentService.updateDocument(document.id, docBody);
                        logger.log(level.info, `Document Updated:${this.utils.beautify(newDocument)}`);
                    })
                } else {
                    // Insert New File for This Account
                    uploadedFile = await this.uploadService.uploadFileToDest(path.join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH), body.file);
                    if (uploadedFile) {
                        const document = {
                            uploaded_by_id: currentAdmin.id,
                            upload_for_account_id: updateId,
                            document_name: uploadedFile.name
                        }
                        const newDocument = await this.documentService.createDocument(document);
                        logger.log(level.info, `New Document Inserted:${this.utils.beautify(newDocument)}`);
                    }
                }
            } */

            const toBeUpdateAccount = await this.accountService.findAccountById(updateId);
            const updated = await this.accountService.updateAccountQuery(updateId, payload);
            logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
            ('created_by_id' in toBeUpdateAccount && toBeUpdateAccount['created_by_id']) ? delete toBeUpdateAccount['created_by_id']['password'] : null;
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Updated SuccessFully",
                data: { ...toBeUpdateAccount, ...payload }
            });
        } catch (error) {
            logger.log(level.error, `updateAccount Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAccountUser })
    @ApiResponse({ type: AccountUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Put('updateAccountStatus/:id')
    async updateAccountStatus(@Param('id') updateId, @Body() body: any, @Request() req, @Response() res) {
        try {

            logger.log(level.info, `updateAccountStatus body=${this.utils.beautify(body)} , param=${this.utils.beautify(updateId)}`);

            const toBeUpdateAccount = await this.accountService.findAccountById(updateId);
            const updated = await this.accountService.updateAccountQuery(updateId, body);
            logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
            ('created_by_id' in toBeUpdateAccount && toBeUpdateAccount['created_by_id']) ? delete toBeUpdateAccount['created_by_id']['password'] : null;
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Updated SuccessFully",
                data: { ...toBeUpdateAccount, ...body }
            });
        } catch (error) {
            logger.log(level.error, `updateAccountStatus Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: AccountDeletedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Delete('deleteAccount/:id')
    async deleteAccount(@Param('id') id: string, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteAccount body=${this.utils.beautify(req.body)} id=${id}`);
            const accountToBeDeleted = await this.accountService.findAccountById(id);
            if (accountToBeDeleted) {
                const docs = await this.documentService.FindDocumentsByAccountId({ account_id: id }).getMany();
                if (docs && docs.length > 0) {
                    docs.forEach(element => {
                        this.uploadService.deleteFileFromDest(path.join(__dirname, '../..', process.env.ASSET_ROOT, process.env.PO_FILES_PATH, element.document_name)).then(async (result) => {
                            logger.log(level.info, `Document File Deleted:${this.utils.beautify(result)}`);
                        });
                    });
                }
            }
            const deleted = await this.accountService.deleteAccountQuery(id).execute();
            logger.log(level.info, `deleted: ${this.utils.beautify(deleted)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Deleted SuccessFully",
                data: deleted
            })
        } catch (error) {

            logger.log(level.error, `deleteAccount Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiBody({ type: CreateBy, description: "created_by can be any ID" })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('getAllAccountsByCreatedId')
    async getAllAccountsByCreatedId(@Body() body: CreateBy, @Response() res) {
        try {
            logger.log(level.info, `getAllAccountsByCreatedId body=${this.utils.beautify(body)}`);
            const filter = {
                "created_by_id": body['created_by'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const accounts = await this.accountService.findAccountByCreatedId(filter);
            logger.log(level.info, `Account List: ${this.utils.beautify(accounts)}`);
            accounts.map(account => delete account['password']);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Fetched SuccessFully",
                data: accounts
            })

        } catch (error) {
            logger.log(level.error, `getAllAccountsByCreatedId Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Account')
    @ApiBody({ type: CreateBy, description: "created_by can be any Admin Id (Role: 2)" })
    @ApiResponse({ type: AccountUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({ transform: false }))
    @Post('getAccountsByAdminAndSubAdmin')
    async getAccountsByAdminAndSubAdmin(@Body() body: CreateBy, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `getAccountsByAdminAndSubAdmin body=${this.utils.beautify(body)}`);
            const filter = {
                "created_by_id": body['created_by'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            'search_query' in body ? filter['search_query'] = body['search_query'] : null ;
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const accounts: any = await this.accountService.getAccountsByAdminAndSubAdmin(filter, currentAdmin);
            // logger.log(level.info, `Account List: ${this.utils.beautify(accounts)}`);
            accounts.data.map(account => {
                ('created_by_id' in account && account['created_by_id']) ? delete account['created_by_id']['password'] : null;
            });
            const response = {
                success: true,
                message: "Fetched SuccessFully",
                data: accounts.data,
                counts: accounts.count
            };
            'limit' in accounts ? response['limit'] = accounts['limit'] : null;
            'offset' in accounts ? response['offset'] = accounts['offset'] : null;
            return this.utils.sendJSONResponse(res, HttpStatus.OK, response);

        } catch (error) {
            logger.log(level.error, `getAccountsByAdminAndSubAdmin Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
