import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsString, IsUUID } from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";
import { defaults } from "src/constants/documentation_default_values.const";
import { AccountUser } from "./account.model";
import { AdminUser } from "./admin.model";
import { Response } from "./common.model";
import { Pagination_Options, Pagination_Options_Response } from "./db_operation.model";

export class Device {

    @ApiProperty()
    id: string;

    @ApiProperty()
    document_name: string;

    @ApiProperty({ type: OmitType(AdminUser, ['password', 'access_token', 'permissions']) })
    uploaded_by: any;

    @ApiProperty({ type: OmitType(AdminUser, ['password', 'access_token', 'permissions']) })
    upload_for_admin: any

    @ApiProperty({ type: OmitType(AccountUser, ['password']) })
    upload_for_account: any

}

export class getAllDeviceReq extends Pagination_Options {

    @IsString()
    @ApiProperty()
    account_id: string;

}
export class getAllDeviceRes extends IntersectionType(Response, Pagination_Options_Response) {

    @IsString()
    @ApiProperty({ type: Device })
    data: Array<Device>;

}

export class updateDeviceReq {

    @IsString()
    @ApiProperty()
    licencekey: String;

    @IsBoolean()
    @ApiProperty()
    status: Boolean;
}

export class updateDeviceRes extends Response {

    @ApiProperty()
    data: any;

}

export class deleteDeviceRes extends Response {

    @ApiProperty()
    data: any;

}




