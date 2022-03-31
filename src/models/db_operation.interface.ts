import { FindManyOptions, FindOptionsWhere, ObjectID } from "typeorm"

export interface Pagination_Options {
  offset?: string | number,
  limit?: string | number,
  order?: {
    [key: string]: 'ASC' | 'DESC'
  }
}

export interface Filter_Options extends Pagination_Options {
  select?: {
    [key: string]: any
  },
  relations?: {
    [key: string]: any
  }
  where?: {
    [key: string]: any
  }
}

export type filterOption = string | number | FindOptionsWhere<any> | Date | ObjectID | string[] | number[] | Date[] | ObjectID[]