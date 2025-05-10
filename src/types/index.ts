export interface DatabaseConfig {
  client: string;
  connection:
    | {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
      }
    | string;
  migrations: {
    directory: string;
    tableName?: string;
  };
  seeds?: {
    directory: string;
  };
  pool?: {
    min: number;
    max: number;
  };
  ssl?:
    | boolean
    | {
        rejectUnauthorized: boolean;
      };
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Entity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface Filters {
  [key: string]: any;
}
