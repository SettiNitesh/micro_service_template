import dotenv from "dotenv";
import path from "path";
import { DatabaseConfig } from "../src/types";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const knexConfig: DatabaseConfig = {
  client: "postgres",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "postgres",
    connectionTimeoutMillis:
      Math.trunc(Number(process.env.DB_CONNECTION_TIMEOUT_MILLIS)) || 10000,
    statementTimeoutMillis:
      Math.trunc(Number(process.env.DB_STATEMENT_TIMEOUT_MILLIS)) || 10000,
  },
  migrations: {
    directory: path.resolve(__dirname, "../migrations"),
    tableName: "knex_migrations",
  },
  seeds: {
    directory: path.resolve(__dirname, "../seeds"),
  },
  pool: {
    min: Math.trunc(Number(process.env.DB_MIN_CONNECTION) || 2),
    max: Math.trunc(Number(process.env.DB_MAX_CONNECTION) || 10),
  },
  acquireConnectionTimeout: 10000,
  asyncStackTraces: false,
  debug: false,
};

export default knexConfig;
