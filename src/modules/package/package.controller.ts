import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Request, Response, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { APP_CONST, ERROR_CONST } from 'src/constants';
import { CreatePackage, DeletePackageResponse, GetAllPackageReq, GetAllPackageRes, Package, UpdatePackage, UpdatePackageRes } from 'src/models/package.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { QueryService } from 'src/shared/services/query.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { PackageService } from './package.service';

@Controller('packagelist')
@UsePipes(new ValidationPipe({ transform: true }))
export class PackageController {

    constructor(private packageService: PackageService, private utils: UtilsService, private queryService: QueryService) {

    }

    @ApiTags('Package')
    @ApiBody({ type: GetAllPackageReq })
    @ApiResponse({ type: GetAllPackageRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAllPackagesByUserId')
    async getAllPackagesByUserId(@Body() body: GetAllPackageReq, @Response() res) {
        try {
            logger.log(level.info, `getAllPackagesByUserId body=${this.utils.beautify(body)}`);
            const filter = {
                "userid": body['userid'],
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }
            'search_query' in body ? filter['search_query'] = body['search_query'] : null;

            const list: any = await this.packageService.FindPackageByCreatedId(filter);
            logger.log(level.info, `Package List: ${this.utils.beautify(list)}`);
            const response = {
                success: true,
                message: "Fetched SuccessFully",
                data: list.data,
                counts: list.count
            };
            'limit' in list ? response['limit'] = list['limit'] : null;
            'offset' in list ? response['offset'] = list['offset'] : null;
            this.utils.sendJSONResponse(res, HttpStatus.OK, response);

        } catch (error) {
            logger.log(level.error, `getAllPackagesByUserId Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Package')
    @ApiBody({ type: CreatePackage })
    @ApiResponse({ type: GetAllPackageRes })
    @Post('createPackage')
    async createPackage(@Body() body: CreatePackage, @Response() res) {
        try {
            logger.log(level.info, `createPackage body=${this.utils.beautify(body)}`);
            const input: CreatePackage = { ...body };

            const inserted: Package = await this.packageService.CreatePackage(input);
            logger.log(level.info, `Package Created : ${this.utils.beautify(inserted)}`);
            return this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Package Created Successfully",
                data: inserted
            });
        } catch (error) {
            logger.log(level.error, `createPackage Error=${error}`);
            return this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Package')
    @ApiParam({ name: 'id' })
    @ApiBody({ type: UpdatePackage })
    @ApiResponse({ type: UpdatePackageRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Put('updatePackageById/:id')
    async updatePackageById(@Param('id') param, @Body() body: UpdatePackage, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `updatePackageById body=${this.utils.beautify(body)}, param=${this.utils.beautify(param)}`);
            const toBeUpdatePackage = await this.packageService.FindPackageById(param);
            delete body['userid'];
            delete body['planid'];
            const updated = await this.packageService.UpdatePackageQuery(param, body);
            logger.log(level.info, `updated: ${this.utils.beautify(updated)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Updated SuccessFully",
                data: { ...toBeUpdatePackage, ...body }
            })
        } catch (error) {

            logger.log(level.error, `updatePackageById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

    @ApiTags('Package')
    @ApiParam({ name: 'id' })
    @ApiResponse({ type: DeletePackageResponse })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Delete('deletePackageById/:id')
    async deletePackageById(@Param('id') id: string, @Request() req, @Response() res) {
        try {
            logger.log(level.info, `deletePackageById body=${this.utils.beautify(req.body)}`);
            const deleted = await this.packageService.DeletePackageQuery(id).execute();
            logger.log(level.info, `deleted: ${this.utils.beautify(deleted)}`);
            this.utils.sendJSONResponse(res, HttpStatus.OK, {
                success: true,
                statusCode: HttpStatus.OK,
                message: "Deleted SuccessFully",
                data: deleted
            })
        } catch (error) {

            logger.log(level.error, `deletePackageById Error=${error}`);
            this.utils.sendJSONResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, {
                success: false,
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: ERROR_CONST.INTERNAL_SERVER_ERROR,
                data: error
            });
        }
    }

}
