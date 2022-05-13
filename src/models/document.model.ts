import { ApiProperty, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";
import { defaults } from "src/constants/documentation_default_values.const";
import { AccountUser } from "./account.model";
import { AdminUser } from "./admin.model";
import { Response } from "./common.model";
import { Pagination_Options, Pagination_Options_Response } from "./db_operation.model";

export class Document {

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

export class DocumentObject extends Document {
    @ApiProperty({ example: defaults.createdAt })
    created_at: string;

    @ApiProperty({ example: defaults.updatedAt })
    updated_at: string;
}

export class getAllDocumentReq extends Pagination_Options {

    @IsString()
    @ApiProperty()
    account_id: string;

}
export class getAllDocumentRes extends IntersectionType(Response, Pagination_Options_Response) {

    @IsString()
    @ApiProperty({ type: DocumentObject })
    data: Array<DocumentObject>;

}

export class PO_File_DTO {

    @ApiProperty()
    @IsFile()
    @HasMimeType(['application/pdf'])
    file: MemoryStoredFile;

}

export class uploadDocumentReq extends PO_File_DTO {

    @IsString()
    @ApiProperty()
    account_id: string;
}

