export interface PaginateOptions {
  page_size?: number;
  current_page?: number;
  distinctWith?: string;
}

export interface PaginationMeta {
  total_items: number;
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface Filters {
  [key: string]: any;
}
