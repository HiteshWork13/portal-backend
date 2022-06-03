import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator"
import { defaults } from "src/constants/documentation_default_values.const";
import { Response } from "./common.model";
import { Pagination_Options } from "./db_operation.model";

export class Login {
    @IsEmail()
    @ApiProperty({ example: defaults.email })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: defaults.password })
    password: string;
}


export class CreateAdminUser extends Login {

    @IsString()
    @ApiProperty({ example: defaults.firstName })
    firstname: string;

    @IsString()
    @ApiProperty({ example: defaults.lastname })
    lastname: string;

    @IsString()
    @ApiProperty({ example: defaults.companyname })
    company: string;

    @IsString()
    @ApiProperty({ example: defaults.street })
    street: string;

    @IsString()
    @ApiProperty({ example: defaults.state })
    state: string;

    @IsString()
    @ApiProperty({ example: defaults.postcode })
    postcode: string;

    @IsNumber()
    @IsIn([1, 2, 3])
    @ApiProperty({ example: defaults.role })
    role: number;

    @IsNumber()
    @IsIn([0, 1])
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.adminStatus })
    status: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdBy })
    created_by: string
}

export class CreateSuperAdminUser extends OmitType(CreateAdminUser, ['created_by']) {

    @IsNotEmpty()
    @ApiProperty({ example: defaults.adminSecret })
    admin_secret: string;
}

export class AdminUser extends CreateAdminUser {

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.adminId })
    id: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.email })
    email: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    password: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdAt })
    created_at: string;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.updatedAt })
    updated_at: string

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.emptyData })
    access_token: string

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.emptyData })
    permissions: any
}


export class UpdateAdminUser {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.firstName })
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.lastname })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.companyname })
    company: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.street })
    street: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.state })
    state: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.postcode })
    postcode: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.password })
    old_password: string;
}
export class UpdateAdminStatus {

    @IsNumber()
    @IsIn([0, 1])
    @ApiProperty({ example: defaults.adminStatus })
    status: number;
}
export class UpdateAdminViewAccountPermission {

    @IsArray()
    @ApiProperty({ example: defaults.sub_admin_list })
    viewAccountPermission: Array<string>;
}



export class RoleIdAndCreateBy extends Pagination_Options {
    @ApiProperty({ example: defaults.role })
    @IsIn([1, 2, 3])
    role: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.createdBy })
    created_by: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.username })
    search_query: string;
}

export class LoginResponse extends Response {
    @ApiProperty({ type: AdminUser })
    data: any
}

export class AdminCreatedResponse extends Response {
    @ApiProperty({ type: OmitType(AdminUser, ["access_token", 'password']) })
    data: any
}

export class AdminUpdatedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Update })
    message: string

    @ApiProperty({ type: OmitType(AdminUser, ["access_token", 'password']) })
    data: any
}

export class AdminDeletedResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Delete })
    message: string
}

export class SearchAdminReq extends RoleIdAndCreateBy {

    @IsString()
    @ApiProperty()
    search_query: string;

}