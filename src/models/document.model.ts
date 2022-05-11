import { ApiProperty, OmitType } from "@nestjs/swagger";
import { AccountUser } from "./account.model";
import { AdminUser } from "./admin.model";

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
    upload_for_account_id: any

}