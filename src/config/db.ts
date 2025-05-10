import dotenv from "dotenv";
import knex, { Knex } from "knex";
import knexConfig from "../../knexfile";
import { DatabaseConfig } from "../types";

dotenv.config();

const environment = process.env.NODE_ENV || "development";

const config: DatabaseConfig = knexConfig[environment];

const db: Knex = knex(config);

export default db;
