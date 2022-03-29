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