import dotenv from "dotenv";
import { DatabaseConfig } from "./src/types";

dotenv.config();

interface knexConfig {
  [key: string]: DatabaseConfig;
}

const config: knexConfig = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "my_database",
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: "pg",
    connection: {
      host: process.env.TEST_DB_HOST || "localhost",
      port: parseInt(process.env.TEST_DB_PORT || "5432"),
      user: process.env.TEST_DB_USER || "postgres",
      password: process.env.TEST_DB_PASSWORD || "postgres",
      database: process.env.TEST_DB_NAME || "service_test_db",
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL || "",
    ssl: { rejectUnauthorized: false },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};

export default config;
