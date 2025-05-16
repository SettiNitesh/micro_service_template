import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserDto } from '../../dtos';
import { usersService } from '../../services';

const userHandler = (fastify: FastifyInstance) => {
  const { createUser } = usersService(fastify);

  async function createUserHandler(request: FastifyRequest, reply: FastifyReply) {
    const { body, logTrace } = request;

    const response = await createUser({
      body: body as CreateUserDto,
      logTrace
    });

    return reply.code(201).send(response);
  }

  return {
    createUserHandler
  };
};

export default userHandler;
