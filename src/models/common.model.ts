import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";

export class Response {

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successBoolean })
    success: boolean;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseCode })
    statusCode: number;

    @IsOptional()
    @ApiPropertyOptional({ example: defaults.successResponseMessage_Get })
    message: string;
}