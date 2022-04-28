import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
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
    @ApiProperty({ example: defaults.username })
    username: string;

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
    created_by_id: string
}

export class CreateSuperAdminUser extends OmitType(CreateAdminUser, ['created_by_id']) {

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
}


export class UpdateAdminUser {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: defaults.username })
    username: string;
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
    created_by_id: string;
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