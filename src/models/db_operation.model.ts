import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString, isString } from "class-validator";
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
export class Pagination_Options_Response {
  @ApiProperty({ example: defaults.page_offset })
  offset: string | number;

  @ApiProperty({ example: defaults.page_limit })
  limit: string | number

  @ApiProperty({ example: defaults.order })
  order: keyValue

  @ApiProperty({ example: defaults.count })
  count: number

}

export class Search_Query {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: defaults.username })
  search_query: string;
}
