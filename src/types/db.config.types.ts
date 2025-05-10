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
