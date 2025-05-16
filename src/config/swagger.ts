import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { FastifyReply, FastifyRequest } from 'fastify';

const SWAGGER_CONFIG = {
  prefix: '/documentation',
  swagger: {
    info: {
      title: process.env.SERVICE_NAME || 'TypeScript Microservice API',
      description: 'API Docs for the Usury Customer Service',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    servers: [
      {
        url: process.env.SERVICE_URL || `http://localhost:${process.env.PORT}`,
        description: 'Local Development'
      }
    ],
    tags: [{ name: "Usury Customer API's" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  }
};

const SWAGGER_UI_CONFIGS: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  initOAuth: {},
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  uiHooks: {
    onRequest(_req: FastifyRequest, _rep: FastifyReply, done: any) {
      done();
    },
    preHandler(_req: FastifyRequest, _rep: FastifyReply, done: any) {
      done();
    }
  },
  staticCSP: true,
  transformStaticCSP: (header: string) => header
};

export { SWAGGER_CONFIG, SWAGGER_UI_CONFIGS };
