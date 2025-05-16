import { FastifyInstance } from "fastify";
import { userHandler } from "../../handlers";
import { userSchemas } from "../../schemas";

const userRoutes = async (fastify: FastifyInstance) => {
  const userHandlers = userHandler(fastify);

  fastify.route({
    method: "POST",
    url: "/users",
    schema: userSchemas.createUserSchema,
    handler: userHandlers.createUserHandler,
  });
};

export default userRoutes;
