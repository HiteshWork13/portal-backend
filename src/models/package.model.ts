import { ApiProperty, ApiPropertyOptional, IntersectionType, OmitType } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEmpty, IsIn, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator"
import { defaults } from "src/constants/documentation_default_values.const";
import { Response } from "./common.model";
import { Pagination_Options } from "./db_operation.model";


export class Package {

    @IsString()
    @ApiProperty({ example: defaults.id })
    id: string;

    @IsString()
    @ApiProperty({ example: defaults.adminId })
    userid: string;

    @IsString()
    @ApiProperty({ example: defaults.packageName })
    packagename: string;

    @IsNumber()
    @ApiProperty({ example: defaults.cost })
    totalcost: string;

    @IsNumber()
    @ApiProperty({ example: defaults.lengthcost })
    lengthcost: string;

    @IsNumber()
    @ApiProperty({ example: defaults.exportcost })
    exportcost: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: defaults.postcode })
    planid: string;
}

export class CreatePackage extends OmitType(Package, ['id']) { }

export class UpdatePackage {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.packageName })
    packagename: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.cost })
    totalcost: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.lengthcost })
    lengthcost: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional({ example: defaults.exportcost })
    exportcost: string;

}

export class GetAllPackageReq extends Pagination_Options {

    @IsString()
    @ApiProperty({ example: defaults.adminId })
    userid: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    search_query: string;

}

export class GetAllPackageRes extends IntersectionType(Package, Response) {
    @ApiProperty({ example: defaults.successResponseMessage_Get })
    message: string
}

export class UpdatePackageRes extends IntersectionType(Package, Response) {

    @ApiProperty({ example: defaults.successResponseMessage_Update })
    message: string

    @ApiProperty({ type: Package })
    data: any
}

export class DeletePackageResponse extends Response {
    @ApiProperty({ example: defaults.successResponseMessage_Delete })
    message: string
}