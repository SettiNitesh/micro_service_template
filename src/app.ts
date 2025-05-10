import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import dotenv from "dotenv";
import fastify, { FastifyInstance } from "fastify";
import { errorHandler } from "./utils/errors";
import logger from "./utils/logger";

dotenv.config();

// Create Fastify instance
const server: FastifyInstance = fastify({
  logger: true,
});

server.log = logger;

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

// Register Swagger documentation
server.register(swagger, {
  prefix: "/documentation",
  swagger: {
    info: {
      title: process.env.SERVICE_NAME || "TypeScript Microservice API",
      description: "API documentation",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
});

// Register your routes here
// Example: server.register(require('./routes/someRoutes'), { prefix: '/api/v1' });

// Global error handler
server.setErrorHandler(errorHandler);

// Root route
server.get("/", async (_request, reply) => {
  return {
    status: "ok",
    service: process.env.SERVICE_NAME || "typescript-microservice-template",
    version: "1.0.0",
  };
});

// Health check endpoint
server.get("/health", async (_request, reply) => {
  return { status: "ok" };
});

// Start the server
const start = async () => {
  try {
    const PORT = parseInt(process.env.PORT || "3000");
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

// Start server if this file is run directly
if (require.main === module) {
  start();
}

export default server;
