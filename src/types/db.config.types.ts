export interface DatabaseConfig {
  client: string;
  connection:
    | {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        connectionTimeoutMillis: number;
        statementTimeoutMillis: number;
      }
    | string;
  migrations: {
    directory: string;
    tableName: string;
  };
  seeds?: {
    directory: string;
  };
  pool?: {
    min: number;
    max: number;
  };
  acquireConnectionTimeout: number;
  asyncStackTraces: boolean;
  debug: boolean;
}
