import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsOptional, IsString, isUUID, IsUUID } from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";
import { defaults } from "src/constants/documentation_default_values.const";
import { AccountUser } from "./account.model";
import { AdminUser } from "./admin.model";
import { Response } from "./common.model";
import { Pagination_Options, Pagination_Options_Response } from "./db_operation.model";

export class HistoryExportDr {

    @ApiProperty()
    id: string;

    @ApiProperty()
    client_id

    @ApiProperty()
    mac: string;

    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    length: number;

    @ApiProperty()
    version: string;

    @ApiProperty()
    trial: boolean;

    @ApiProperty()
    app_type: number;
}

export class getAllHistoryDrReq extends Pagination_Options {

    @ApiProperty()
    client_id
}

export class getAllHistoryRes extends IntersectionType(Response, HistoryExportDr) { }