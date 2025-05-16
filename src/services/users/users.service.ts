import { FastifyInstance } from "fastify";
import { CreateUserDto } from "../../dtos";
import { usersRepository } from "../../repository";
import { LogTrace } from "../../types";

const usersService = (fastify: FastifyInstance) => {
  const { createUser } = usersRepository(fastify);

  async function createUserService({
    body,
    logTrace,
  }: {
    body: CreateUserDto;
    logTrace: LogTrace;
  }) {
    const { knex } = fastify;

    const {
      mobile_number,
      alternate_mobile_number,
      email_address,
      ...restprops
    } = body;

    return createUser.call(knex, {
      input: {
        mobile_number,
        alternate_mobile_number,
        email_address,
        ...restprops,
      },
      logTrace,
    });
  }

  return {
    createUser: createUserService,
  };
};

export default usersService;
