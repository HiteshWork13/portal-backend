import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, Response, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AdminCreatedResponse, AdminDeletedResponse, AdminUpdatedResponse, AdminUser, CreateAdminUser, CreateSuperAdminUser, RoleIdAndCreateBy, UpdateAdminStatus, UpdateAdminUser, UpdateAdminViewAccountPermission } from 'src/models/admin.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { AdminService } from './admin.service';

@Controller('admin')
@UsePipes(new ValidationPipe({ transform: true }))
export class AdminController {

    constructor(private adminService: AdminService, private utils: UtilsService, private queryService: QueryService) {

    }

    @ApiTags('Admin')
    @ApiBody({ type: CreateSuperAdminUser })
    @ApiResponse({ type: AdminCreatedResponse })
    @Post('createSuperAdmin')
    async createSuperAdmin(@Body() body: CreateSuperAdminUser, @Response() res) {
        try {
            logger.log(level.info, `createSuperAdmin body=${this.utils.beautify(body)}`);
            const input: CreateSuperAdminUser = { ...body };
            input['created_by_id'] = null;
            if (body.admin_secret == process.env.ADMIN_SECRET) {
                const inserted: AdminUser = await this.adminService.CreateAdmin(input);
                delete inserted.password;
                logger.log(level.info, `New Super Admin Created : ${this.utils.beautify(inserted)}`);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Super Admin Created Successfully",
                    data: inserted
                });
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    statusCode: HttpStatus.FORBIDDEN,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: null
                });
            }
        } catch (error) {
            logger.log(level.error, `createAdminUser Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Admin')
    @ApiBody({ type: CreateAdminUser })
    @ApiResponse({ type: AdminCreatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('createAdminUser')
    async createAdminUser(@Body() body: CreateAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createAdminUser body=${this.utils.beautify(body)}`);
            const currentAdmin: AdminUser = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_creation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
                [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
            }
            const input: CreateAdminUser = body;
            input.created_by_id = currentAdmin['id'];
            if (admin_creation_access[currentAdmin['role']] && admin_creation_access[currentAdmin['role']].indexOf(input['role']) >= 0) {
                const inserted = await this.adminService.CreateAdmin(input);
                delete inserted.password;
                logger.log(level.info, `New Admin Created : ${this.utils.beautify(inserted)}`);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    message: "Admin Created Successfully",
                    data: inserted
                });
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }

        } catch (error) {
            logger.log(level.error, `createAdminUser Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Admin')
    @ApiBody({ type: RoleIdAndCreateBy })
    @ApiResponse({ type: AdminUser })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAllAdminByRoleIdAndCreatedId')
    async getAllAdminByRoleIdAndCreatedId(@Body() body: RoleIdAndCreateBy, @Response() res) {
        try {
            logger.log(level.info, `getAllAdminByRoleIdAndCreatedId body=${this.utils.beautify(body)}`);
            const filter = {
                "role": body['role'],
                "created_by_id": body['created_by_id'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const list = await this.adminService.FindAdminByRoleIdAndCreatedId(filter).execute();
            logger.log(level.info, `Admin List: ${this.utils.beautify(list)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Fetched SuccessFully",
                data: list
            })

        } catch (error) {
            logger.log(level.error, `getAllAdminByRoleIdAndCreatedId Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Admin')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAdminUser })
    @ApiResponse({ type: AdminUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateAdminById/:id')
    async updateAdminById(@Param('id') param, @Body() body: UpdateAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateAdminById body=${this.utils.beautify(body)}, param=${this.utils.beautify(param)}`);
            const currentAdmin = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_updation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
                [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
            }
            const toBeUpdateAdmin = await this.adminService.FindAdminById(param);
            if (admin_updation_access[currentAdmin['role']] && admin_updation_access[currentAdmin['role']].indexOf(toBeUpdateAdmin['role']) >= 0) {
                const updated = await this.adminService.UpdateAdminQuery(param, body);
                logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
                this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Updated SuccessFully",
                    data: { ...toBeUpdateAdmin, ...body, password: null }
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    statusCode: HttpStatus.FORBIDDEN,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `updateAdminById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Admin')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: AdminDeletedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Delete('deleteAdminById/:id')
    async deleteAdminById(@Param('id') id: string, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteAdminById body=${this.utils.beautify(req.body)}`);
            const currentAdmin = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_creation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE]
            }
            const toBeDeleteAdmin = await this.adminService.FindAdminById(id);
            if (toBeDeleteAdmin && admin_creation_access[currentAdmin['role']] && admin_creation_access[currentAdmin['role']].indexOf(toBeDeleteAdmin['role']) >= 0) {
                const deleted = await this.adminService.DeleteAdminQuery(id).execute();
                logger.log(level.info, `deleted: ${this.utils.beautify(deleted)}`);
                this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Deleted SuccessFully",
                    data: deleted
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    statusCode: HttpStatus.FORBIDDEN,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `deleteAdminById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Admin')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAdminStatus })
    @ApiResponse({ type: AdminUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateStatusById/:id')
    async updateStatusById(@Param('id') param, @Body() body: UpdateAdminStatus, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateStatusById body=${this.utils.beautify(body)}, param=${this.utils.beautify(param)}`);
            const currentAdmin = await this.queryService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_updation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
                [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
            }
            const toBeUpdateAdmin = await this.adminService.FindAdminById(param);
            if (toBeUpdateAdmin && admin_updation_access[currentAdmin['role']] && admin_updation_access[currentAdmin['role']].indexOf(toBeUpdateAdmin['role']) >= 0) {
                const updated = await this.adminService.UpdateAdminQuery(param, body);
                logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
                this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Status Updated SuccessFully",
                    data: { ...toBeUpdateAdmin, ...body, password: null }
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    statusCode: HttpStatus.FORBIDDEN,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `updateStatusById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Permissions')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdateAdminViewAccountPermission })
    @ApiResponse({ type: AdminUpdatedResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateViewAccountPermission/:id')
    async updateViewAccountPermission(@Param('id') updateId, @Body() body: UpdateAdminViewAccountPermission, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateStatusById body=${this.utils.beautify(body)}, param=${this.utils.beautify(updateId)}`);
            const toBeUpdateAdmin = await this.adminService.FindAdminById(updateId);
            if (toBeUpdateAdmin) {
                const json = toBeUpdateAdmin.permissions
                json['viewAccounts'] = body.viewAccountPermission;
                console.log('json: ', json);
                const updated = await this.adminService.UpdateAdminQuery(updateId, { permissions: json });
                logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
                this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Status Updated SuccessFully",
                    data: { ...toBeUpdateAdmin, ...({ permissions: json }), password: null }
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.NOT_FOUND, {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    message: ERROR_CONST.ADMIN_NOT_FOUND,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `updateStatusById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
