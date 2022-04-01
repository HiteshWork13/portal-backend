import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminUser, NewAdminUser, NewSuperAdminUser, UpdateAdminUser } from 'src/models/admin.interface';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { UtilsService } from 'src/shared/services/utils.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService, private utils: UtilsService) {

    }

    @ApiBody({
        description: `
        body: {
            username: String
            email: String
            password: String
            status?: 0 | 1   <== default : 1
            role: 1
            admin_secret: String
        }
    `})
    @Post('createSuperAdmin')
    async createSuperAdmin(@Body() body: NewSuperAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createSuperAdmin body=${this.utils.beautify(body)}`);
            const input: NewAdminUser = { ...body };
            input['created_by'] = null;
            if (body.admin_secret == process.env.ADMIN_SECRET) {
                const inserted = await this.adminService.CreateAdmin(input);
                logger.log(level.info, `New Super Admin Created : ${this.utils.beautify(inserted)}`);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    message: "Super Admin Created Successfully",
                    data: inserted
                });
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: true,
                    message: "Access Denied",
                    data: null
                });
            }

        } catch (error) {
            logger.log(level.error, `createAdminUser Error=error`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({
        description: `
        body: {
            username: String
            email: String
            password: String
            status?: 0 | 1   <== default : 1
            role: 1 | 2 | 3  
                1: super admin,
                2: admin
                3: sub admin
            created_by?: <String Id>
        }
    `})
    @UseGuards(JwtAuthGuard)
    @Post('createAdminUser')
    async createAdminUser(@Body() body: NewAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `createAdminUser body=${this.utils.beautify(body)}`);
            const currentAdmin: AdminUser = await this.adminService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_creation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
                [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
            }
            const input: NewAdminUser = body;
            input.created_by = currentAdmin['id'];
            if (admin_creation_access[currentAdmin['role']] && admin_creation_access[currentAdmin['role']].indexOf(input['role']) >= 0) {
                const inserted = await this.adminService.CreateAdmin(input);
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
            logger.log(level.error, `createAdminUser Error=error`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({
        description: `
        body: {
            role : 1 | 2 | 3,
            created_by ?: <string_id>
        }
    `})
    @UseGuards(JwtAuthGuard)
    @Post('getAllAdminByRoleIdAndCreatedId')
    async getAllAdminByRoleIdAndCreatedId(@Body() body: NewAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `getAllAdminByRoleIdAndCreatedId body=${this.utils.beautify(body)}`);
            const list = await this.adminService.FindAdminByRoleIdAndCreatedId(req.body['role'], req.body['created_by']).execute();
            logger.log(level.info, `Admin List: ${this.utils.beautify(list)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                message: "Fetched SuccessFully",
                data: list
            })

        } catch (error) {
            logger.log(level.error, `getAllAdminByRoleIdAndCreatedId Error=error`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({
        description: `
        body: {
            id: string
        }
    `})
    @UseGuards(JwtAuthGuard)
    @Delete('deleteAdminById/:id')
    async deleteAdminById(@Param('id') id: string, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deleteAdminById body=${this.utils.beautify(req.body)}`);
            const currentAdmin = await this.adminService.FindAdminByEmailOnly(req.user.email);
            logger.log(level.info, `currentAdmin: ${this.utils.beautify(currentAdmin)}`);
            const admin_creation_access = {
                [APP_CONST.SUPER_ADMIN_ROLE]: [APP_CONST.ADMIN_ROLE, APP_CONST.SUB_ADMIN_ROLE],
                [APP_CONST.ADMIN_ROLE]: [APP_CONST.SUB_ADMIN_ROLE]
            }
            const toBeDeleteAdmin = await this.adminService.FindAdminById(id);
            if (admin_creation_access[currentAdmin['role']] && admin_creation_access[currentAdmin['role']].indexOf(toBeDeleteAdmin['role']) >= 0) {
                const deleted = await this.adminService.DeleteAdminQuery(id).execute();
                logger.log(level.info, `deleted: ${this.utils.beautify(deleted)}`);
                this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    message: "Deleted SuccessFully",
                    data: deleted
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `deleteAdminById Error=error`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiBody({
        description: `
        body: {
            username: string
        }
    `})
    @UseGuards(JwtAuthGuard)
    @Put('updateAdminById/:id')
    async updateAdminById(@Param('id') param, @Body() body: UpdateAdminUser, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updateAdminById body=${this.utils.beautify(body)}, param=${this.utils.beautify(param)}`);
            const currentAdmin = await this.adminService.FindAdminByEmailOnly(req.user.email);
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
                    message: "Updated SuccessFully",
                    data: { ...toBeUpdateAdmin, ...body, password: null }
                })
            } else {
                this.utils.sendJSONResponse(res, HttpStatus.FORBIDDEN, {
                    success: false,
                    message: ERROR_CONST.DOES_NOT_HAVE_ACCESS,
                    data: {}
                });
            }
        } catch (error) {

            logger.log(level.error, `updateAdminById Error=error`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }
}
