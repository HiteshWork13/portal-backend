import { ApiProperty, ApiPropertyOptional, IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { IsBoolean,  IsDateString, IsEmail, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";
import { AdminUser } from "./admin.model";
import { Response } from "./common.model";
import { Pagination_Options, Search_Query } from "./db_operation.model";
import { IsFile, HasMimeType, MemoryStoredFile } from "nestjs-form-data";
export class CreateAccount {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.code })
    code: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.firstName })
    firstname: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.lastname })
    lastname: String;

    @IsString()
    @IsOptional()
    @MaxLength(250)
    @ApiProperty({ example: defaults.companyname })
    companyname: String;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    @ApiProperty({ example: defaults.phone })
    phone: String;

    @IsString()
    @IsOptional()
    @MaxLength(400)
    @ApiProperty({ example: defaults.address })
    address: String;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    @ApiProperty({ example: defaults.postcode })
    postcode: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.country })
    country: String;

    @IsEmail()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.billingemail })
    billingemail: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.customerid })
    customerid: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ example: defaults.vat })
    vat: String;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.packageid })
    packageid: Number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.accounttype })
    accounttype: Number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.credits })
    credits: Number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.purchased })
    purchased: Boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.password })
    password: String;

    @IsEmail()
    @IsOptional()
    @ApiProperty({ example: defaults.email })
    email: String;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.emailverified })
    emailverified: Boolean;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    verificationtoken: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty({ example: defaults.city })
    city: String;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.triallimit })
    triallimit: Number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.ac_role })
    role: Number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.twofactor })
    twofactor: Boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.totaldevices })
    totaldevices: Number;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.payasgo })
    payasgo: Boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.payid })
    payid: Number;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ example: defaults.purchasedate })
    purchasedate: Date;

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    registrationtype: Number;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.createdBy, nullable: true })
    created_by: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    enduser_street: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty()
    enduser_state: String;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    enduser_email: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    reseller_company: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    reseller_street: String;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    @ApiProperty()
    reseller_state: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    reseller_code: String;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    @ApiProperty()
    reseller_firstname: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    reseller_lastname: String;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty()
    enduser_classification: String;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    reseller_email: String;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ example: defaults.expirydate })
    expirydate: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.analyticsstatus })
    analyticsstatus: Boolean;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.packageid_dr })
    packageid_dr: Number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.size_dr })
    size_dr: Number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: defaults.totaldevices_dr })
    totaldevices_dr: Number;

    @IsDateString()
    @IsOptional()
    @ApiProperty({ example: defaults.expirydate_dr })
    expirydate_dr: Date;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: defaults.communicationstatus })
    communicationstatus: Boolean;

}

export class PO_File_DTO {

    @ApiPropertyOptional()
    @IsFile()
    @HasMimeType(['application/pdf'])
    file: MemoryStoredFile;

}

export class CreateAccountReq extends PO_File_DTO {

    @ApiProperty()
    data: string

}

export class CreateAccountReqDoc extends PO_File_DTO {

    @ApiProperty({ type: CreateAccount })
    data: any;

}


export class AccountUser extends CreateAccount {
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.adminId })
    id: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdAt })
    created_at: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.updatedAt })
    updated_at: string;

    @IsOptional()
    @ApiPropertyOptional({ type: OmitType(AdminUser, ["access_token", 'password']), nullable: true })
    created_by_id: any;

}


export class CreateBy extends IntersectionType(Search_Query, Pagination_Options) {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdBy })
    created_by: string;
}

export class UpdateAccountUser extends OmitType(CreateAccount, ['verificationtoken', 'created_by']) { }


export class UpdateAccountReq extends PO_File_DTO {
    @ApiProperty()
    data: string
}

export class UpdateAccountReqDoc extends PO_File_DTO {
    @ApiProperty({ type: UpdateAccountUser })
    data: any;
}



export class AccountUpdatedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Update })
    message: string

    @ApiProperty({ type: AccountUser })
    data: any
}

export class AccountDeletedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Delete })
    message: string
}

export class AccountCreatedResponse extends Response {
    @ApiProperty({ type: AccountUser })
    data: any

    @ApiProperty({ example: defaults.successResponseMessage_Create })
    message: string
}
