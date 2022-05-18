import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import path, { join } from 'path';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { AdminUser } from 'src/models/admin.model';
import { deleteDeviceRes, getAllDeviceReq, getAllDeviceRes, updateDeviceReq, updateDeviceRes } from 'src/models/device.model';
import { deleteDocumentRes, getAllDocumentReq, getAllDocumentRes, PO_File_DTO, updateDocumentReq, updateDocumentRes, uploadDocumentReq, uploadDocumentRes } from 'src/models/document.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { DeviceService } from './device.service';

@Controller('device')
@UsePipes(new ValidationPipe({ transform: false }))
export class DeviceController {

    constructor(private deviceService: DeviceService, private utils: UtilsService, private queryService: QueryService) {

    }

    @ApiTags('Devices')
    @ApiBody({ type: getAllDeviceReq })
    @ApiResponse({ type: getAllDeviceRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAllDevices')
    async getAllDevices(@Body() body: getAllDeviceReq, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `getAllDevices account_id=${this.utils.beautify(body)}`);
            const filter = {
                "account_id": body.account_id,
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            const result:any = await this.deviceService.FindDeviceByAccountId(filter);
            logger.log(level.info, `Device : ${this.utils.beautify(result)}`)
            const response = {
                success: true,
                message: "Device Fetched Successfully.",
                data: result.data,
                counts: result.count
            }
            'limit' in body ? response['limit'] = body['limit'] : null;
            'offset' in body ? response['offset'] = body['offset'] : null;
            return this.utils.sendJSONResponse(res, HttpStatus.OK, response);
        } catch (error) {
            logger.log(level.error, `getAllDevices Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Devices')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: updateDeviceReq })
    @ApiResponse({ type: updateDeviceRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updateDevice/:id')
    async updateDevice(@Param('id') id: string, @Body() body: updateDeviceReq, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `updateDevice account_id=${body}`);
            const device = await this.deviceService.FindDeviceById(id);
            logger.log(level.info, `device Found:${this.utils.beautify(device)}`);
            if (device) {
                // Update Device File.
                const newDevice = await this.deviceService.updateDevice(device.id, body);
                logger.log(level.info, `Device Updated:${this.utils.beautify(newDevice)}`);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Device Updated Successfully.",
                    data: newDevice
                });
            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: ERROR_CONST.DEVICE_NOT_FOUND,
                    data: null
                });
            }
        } catch (error) {
            logger.log(level.error, `updateDevice Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Devices')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: deleteDeviceRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Delete('deleteDevice/:id')
    async deleteDevice(@Param('id') id: any, @Req() req, @Res() res) {
        try {
            logger.log(level.info, `deleteDocument account_id=${id}`);

            const device = await this.deviceService.FindDeviceById(id);
            logger.log(level.info, `Device Found:${this.utils.beautify(device)}`);
            if (device) {

                const deleted = await this.deviceService.deleteDevice(id);
                return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                    success: true,
                    statusCode: HttpStatus.OK,
                    message: "Device Deleted Successfully.",
                    data: deleted
                });

            } else {
                return this.utils.sendJSONResponse(res, HttpStatus.BAD_REQUEST, {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: ERROR_CONST.DEVICE_NOT_FOUND,
                    data: null
                });
            }
        } catch (error) {
            logger.log(level.error, `deleteDevice Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
