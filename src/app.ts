import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import dotenv from "dotenv";
import fastify, { FastifyInstance, FastifyReply } from "fastify";
import ajvPlugin from "./plugins/ajv.plugin";
import { FastifyRequestExtended } from "./types";
import { errorHandler } from "./utils/errors";
import logger from "./utils/logger";

dotenv.config();

// Create Fastify instance
const server: FastifyInstance = fastify({
  logger: true,
});

server.log = logger;

// Global onRequest hook
server.addHook(
  "onRequest",
  (request: FastifyRequestExtended, reply: FastifyReply, done) => {
    const startTime = Date.now();

    request.requestTime = startTime;

    if (!request.id) {
      request.id =
        (request.headers["x-request-id"] as string) || Date.now().toString();
    }

    server.log.info({
      requestId: request.id,
      method: request.method,
      url: request.url,
      headers: request.headers,
      message: "Request received",
    });

    done(); // Continue processing the request
  }
);

// Global onResponse hook
server.addHook(
  "onResponse",
  (request: FastifyRequestExtended, reply: FastifyReply, done) => {
    const endTime = Date.now();
    const startTime = request.requestTime || endTime;
    const responseTime = endTime - startTime;

    server.log.info({
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: `${responseTime}ms`,
      message: "Response sent",
    });
    done(); // Continue processing the response
  }
);

// Register plugins
server.register(cors, {
  origin: (origin, cb) => {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) {
      return cb(null, true);
    }
    // Allow specific origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000"];

    if (allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed by CORS"), false);
  },
});

server.register(helmet);

server.register(ajvPlugin);

// Register Swagger documentation
server.register(swagger, {
  prefix: "/documentation",
  openapi: {
    info: {
      title: process.env.SERVICE_NAME || "TypeScript Microservice API",
      description: "API documentation",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
});

server.register(swaggerUi, {
  routePrefix: "/documentation",
});

// Register your routes here
// Example: server.register(require('./routes/someRoutes'), { prefix: '/api/v1' });

// Global error handler
server.setErrorHandler(errorHandler);

// Root route
server.get("/", async (_request, _reply) => {
  return {
    status: "ok",
    service: process.env.SERVICE_NAME || "typescript-microservice-template",
    version: "1.0.0",
  };
});

// Start the server
const start = async () => {
  try {
    const PORT = parseInt(process.env.PORT || "8000");
    await server.listen({ port: PORT, host: "0.0.0.0" });
    const address = server.server.address();
    if (address) {
      server.log.info(
        `Server listening on ${
          typeof address === "string" ? address : address.port
        }`
      );
    } else {
      server.log.info(`Server started on port ${PORT}`);
    }
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle unhandled rejections and exceptions
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

start();

export default server;
