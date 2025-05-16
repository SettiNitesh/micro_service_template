import { FastifyBaseLogger } from 'fastify';
import { Knex } from 'knex';

export interface LogQuery {
  logger: FastifyBaseLogger;
  query: Knex.QueryBuilder;
  context: string;
  logTrace: LogTrace;
}

export type LogTrace = Record<string, string> | undefined;
