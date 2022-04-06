import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAccount {
    @IsString()
    @ApiProperty()
    code: String;


    @ApiProperty()
    firstname: String;

    @ApiProperty()
    lastname: String;

    @ApiProperty()
    companyname: String;

    @ApiProperty()
    phone: String;

    @ApiProperty()
    address: String;

    @ApiProperty()
    postcode: String;

    @ApiProperty()
    country: String;

    @ApiProperty()
    billingemail: String;

    @ApiProperty()
    customerid: String;

    @ApiProperty()
    vat: String;

    @ApiProperty()
    packageid: Number;

    @ApiProperty()
    accounttype: Number;

    @ApiProperty()
    credits: Number;

    @ApiProperty()
    purchased: Boolean;

    @ApiProperty()
    password: String;

    @ApiProperty()
    email: String;

    @ApiProperty()
    emailverified: Boolean;

    @ApiProperty()
    verificationtoken: String;

    @ApiProperty()
    city: String;

    @ApiProperty()
    triallimit: Number;

    @ApiProperty()
    role: Number;

    @ApiProperty()
    twofactor: Boolean;

    @ApiProperty()
    totaldevices: Number;

    @ApiProperty()
    payasgo: Boolean;

    @ApiProperty()
    payid: Number;

    @ApiProperty()
    purchasedate: Date;

    @ApiProperty()
    registrationtype: Number;

    @ApiProperty()
    created_by: String;

    @ApiProperty()
    enduser_street: String;

    @ApiProperty()
    enduser_state: String;

    @ApiProperty()
    enduser_email: String;

    @ApiProperty()
    reseller_company: String;

    @ApiProperty()
    reseller_street: String;

    @ApiProperty()
    reseller_state: String;

    @ApiProperty()
    reseller_code: String;

    @ApiProperty()
    reseller_firstname: String;

    @ApiProperty()
    reseller_lastname: String;

    @ApiProperty()
    enduser_classification: String;

    @ApiProperty()
    reseller_email: String;

    @ApiProperty()
    expirydate: Date;

    @ApiProperty()
    analyticsstatus: Boolean;

    @ApiProperty()
    packageid_dr: Number;

    @ApiProperty()
    size_dr: Number;

    @ApiProperty()
    totaldevices_dr: Number;

    @ApiProperty()
    expirydate_dr: Date;

    @ApiProperty()
    communicationstatus: Boolean;

}