import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import envSchema from 'env-schema';
import fastify, { FastifyInstance } from 'fastify';
import fastifyHealthcheck from 'fastify-healthcheck';
import { knexConfig } from '../config';
import { schema } from './common';
import { corsOptions, SWAGGER_CONFIG, SWAGGER_UI_CONFIGS } from './config';
import { extractLogTrace, requestLogging, responseLogging } from './hooks';
import { ajvPlugin, knexPlugin } from './plugins';
import { userRoutes } from './routes';
import { logger } from './utils';
import { errorHandler } from './utils/error';

const create = async () => {
  // Create Fastify instance
  const server: FastifyInstance = fastify({
    logger: true
  });

  server.log = logger;

  // Global error handler
  server.setErrorHandler(errorHandler());

  await server.register(fastifyHealthcheck);

  // Env vars plugin
  await server.register(fastifyEnv, {
    dotenv: true,
    schema: schema
  });

  // Global Hooks
  server.addHook('onRequest', extractLogTrace);
  server.addHook('preValidation', requestLogging);
  server.addHook('onResponse', responseLogging);

  // Register plugins
  await server.register(helmet);
  await server.register(ajvPlugin);
  await server.register(knexPlugin, knexConfig);
  await server.register(swagger, SWAGGER_CONFIG);
  await server.register(swaggerUi, SWAGGER_UI_CONFIGS);
  await server.register(cors, corsOptions);

  // Register Routes
  server.register(userRoutes, { prefix: '/api/v1' });

  return server;
};

// Start the server
const start = async () => {
  const fastify = await create();
  const defaultSchema = {
    type: 'object',
    properties: {
      HOST: {
        type: 'string',
        default: '0.0.0.0'
      },
      PORT: {
        type: 'number',
        default: 4444
      }
    }
  };
  try {
    const config = envSchema<{
      HOST: string;
      PORT: number;
    }>({
      schema: defaultSchema,
      dotenv: true
    });

    fastify.listen(
      { port: config.PORT, host: config.HOST },
      (err: Error | null, address: string) => {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        fastify.log.info(`Server is running on ${address}`);
      }
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { create, start };
