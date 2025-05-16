import { FastifyInstance } from 'fastify';
import { Knex } from 'knex';
import { USER } from '../../constants';
import { CreateUserParams } from '../../types';
import { logQuery } from '../../utils';

const usersRepository = (fastify: FastifyInstance) => {
  async function createUser(this: Knex, { input, logTrace }: CreateUserParams) {
    const knex = this;

    const insertQuery = knex(USER.NAME)
      .insert({
        ...input
      })
      .returning('*');

    logQuery({
      logger: fastify.log,
      query: insertQuery,
      context: 'Create User',
      logTrace
    });

    const response = await insertQuery;

    return response[0];
  }

  return {
    createUser
  };
};

export default usersRepository;
