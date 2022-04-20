import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";
import { AdminUser } from "./admin.model";
import { Pagination_Options } from "./db_operation.model";

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
    @ApiProperty({ example: defaults.createdBy })
    created_by_id: String;

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
    @ApiPropertyOptional({ type: OmitType(AdminUser, ["access_token", 'password']) })
    created_by: any
}

export class UpdateAccountUser extends OmitType(CreateAccount, ['emailverified', 'verificationtoken', 'created_by_id']) {}

export class CreateBy extends Pagination_Options {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdBy })
    created_by_id: string;
}