import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { level, logger } from 'src/config';
import { ERROR_CONST } from 'src/constants';
import { getAllHistoryDrReq,getAllHistoryRes } from 'src/models/history_export_dr.model';
import { JwtAuthGuard } from 'src/shared/gaurds/jwt-auth.guard';
import { UtilsService } from 'src/shared/services/utils.service';
import { HistoryExportDrService } from './history-export-dr.service';

@Controller('history-export-dr')
export class HistoryExportDrController {

    constructor(private historyExportDrService: HistoryExportDrService, private utils: UtilsService) {
    }

    @ApiTags('History Export Dr')
    @ApiBody({ type: getAllHistoryDrReq, description: "client_id Can be User Id " })
    @ApiResponse({ type: getAllHistoryRes })
    @ApiBearerAuth("access_token")
    @UseGuards(JwtAuthGuard)
    @Post('getAllHistoryDr')
    async getAllHistory(@Body() body: getAllHistoryDrReq, @Res() res) {
        try {
            // this.historyExportService.insertDefault();
            logger.log(level.info, `getAllHistoryDr body=${this.utils.beautify(body)}`);
            const filter = {
                "client_id": body.client_id,
                "offset": body['offset'],
                "limit": body['limit'],
                "order": body['order'],
            }

            const history: any = await this.historyExportDrService.findHistoryByClientId(filter);
            const response = {
                success: true,
                message: "Fetched SuccessFully",
                data: history.data,
                counts: history.count
            };
            'limit' in history ? response['limit'] = history['limit'] : null;
            'offset' in history ? response['offset'] = history['offset'] : null;
            return this.utils.sendJSONResponse(res, HttpStatus.OK, response);

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
