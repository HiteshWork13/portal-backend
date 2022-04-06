import { ApiProperty } from "@nestjs/swagger"
import { IsOptional } from "class-validator";
import { defaults } from "src/constants/documentation_default_values.const";
import { IsInNested } from "src/shared/validators/is-in-nested.validator";

export class keyValue {
  [key: string]: string
}

export class Pagination_Options {
  @ApiProperty({ example: defaults.page_offset })
  offset: string | number;

  @ApiProperty({ example: defaults.page_limit })
  limit: string | number

  @IsOptional()
  @IsInNested(['ASC', 'DESC'])
  @ApiProperty({ example: defaults.order })
  order: keyValue
}