import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import knex from 'knex';
import { DatabaseConfig } from '../../types';
import { connectionCheck } from '../../utils/helper';
import setupPagination from './paginator';

const knexPlugin = async (fastify: FastifyInstance, options: DatabaseConfig) => {
  try {
    // Set up pagination on the Knex instance
    const db = knex({ ...options });
    setupPagination(db);
    await connectionCheck(db);
    fastify.decorate('knex', db);
    fastify.log.info(`DB connection successful`);
  } catch (e) {
    fastify.log.error(`DB connection failed`);
    throw Error(`Connection Failed ${e}`);
  }
};

export default fp(knexPlugin);
