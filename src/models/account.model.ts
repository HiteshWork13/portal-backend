import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsEmail, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";

export class CreateAccount {
    @IsString()
    @ApiProperty({ example: defaults.code })
    code: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: defaults.firstName })
    firstname: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: defaults.lastname })
    lastname: String;

    @IsString()
    @MaxLength(250)
    @ApiProperty({ example: defaults.companyname })
    companyname: String;

    @IsString()
    @MaxLength(20)
    @ApiProperty({ example: defaults.phone })
    phone: String;

    @IsString()
    @MaxLength(400)
    @ApiProperty({ example: defaults.address })
    address: String;

    @IsString()
    @MaxLength(10)
    @ApiProperty({ example: defaults.postcode })
    postcode: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: defaults.country })
    country: String;

    @IsEmail()
    @MaxLength(100)
    @ApiProperty({ example: defaults.billingemail })
    billingemail: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: defaults.customerid })
    customerid: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty({ example: defaults.vat })
    vat: String;

    @IsNumber()
    @ApiProperty({ example: defaults.packageid })
    packageid: Number;

    @IsNumber()
    @ApiProperty({ example: defaults.accounttype })
    accounttype: Number;

    @IsNumber()
    @ApiProperty({ example: defaults.credits })
    credits: Number;

    @IsBoolean()
    @ApiProperty({ example: defaults.purchased })
    purchased: Boolean;

    @IsString()
    @ApiProperty({ example: defaults.password })
    password: String;

    @IsEmail()
    @ApiProperty({ example: defaults.email })
    email: String;

    @IsBoolean()
    @ApiProperty({ example: defaults.emailverified })
    emailverified: Boolean;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    verificationtoken: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty({ example: defaults.city })
    city: String;

    @IsNumber()
    @ApiProperty({ example: defaults.triallimit })
    triallimit: Number;

    @IsNumber()
    @ApiProperty({ example: defaults.ac_role })
    role: Number;

    @IsBoolean()
    @ApiProperty({ example: defaults.twofactor })
    twofactor: Boolean;

    @IsNumber()
    @ApiProperty({ example: defaults.totaldevices })
    totaldevices: Number;

    @IsBoolean()
    @ApiProperty({ example: defaults.payasgo })
    payasgo: Boolean;

    @IsNumber()
    @ApiProperty({ example: defaults.payid })
    payid: Number;

    @IsDateString()
    @ApiProperty({ example: defaults.purchasedate })
    purchasedate: Date;

    @IsNumber()
    @ApiProperty()
    registrationtype: Number;

    @IsString()
    @ApiProperty({ example: defaults.createdBy })
    created_by: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    enduser_street: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty()
    enduser_state: String;

    @IsEmail()
    @ApiProperty()
    enduser_email: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    reseller_company: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    reseller_street: String;

    @IsString()
    @MaxLength(200)
    @ApiProperty()
    reseller_state: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    reseller_code: String;

    @IsString()
    @MaxLength(100)
    @ApiProperty()
    reseller_firstname: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    reseller_lastname: String;

    @IsString()
    @MaxLength(300)
    @ApiProperty()
    enduser_classification: String;

    @IsEmail()
    @ApiProperty()
    reseller_email: String;

    @IsDateString()
    @ApiProperty({ example: defaults.expirydate })
    expirydate: Date;

    @IsBoolean()
    @ApiProperty({ example: defaults.analyticsstatus })
    analyticsstatus: Boolean;

    @IsNumber()
    @ApiProperty({ example: defaults.packageid_dr })
    packageid_dr: Number;

    @IsNumber()
    @ApiProperty({ example: defaults.size_dr })
    size_dr: Number;

    @IsNumber()
    @ApiProperty({ example: defaults.totaldevices_dr })
    totaldevices_dr: Number;

    @IsDateString()
    @ApiProperty({ example: defaults.expirydate_dr })
    expirydate_dr: Date;

    @IsBoolean()
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
    updated_at: string
}