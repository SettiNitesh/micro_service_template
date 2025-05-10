import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { BaseController } from "../controllers/base.controller";
import { Audit } from "../models";

// This is a type for route schema that can be customized per service
export interface RouteSchema {
  getAll?: any;
  getById?: any;
  create?: any;
  update?: any;
  delete?: any;
}

export function buildRoutes<T extends Audit>(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  controller: BaseController<T>,
  basePath: string,
  schema: RouteSchema = {}
): void {
  // GET all items
  fastify.get(`/${basePath}`, {
    schema: schema.getAll || {
      querystring: {
        type: "object",
        properties: {
          page: { type: "integer", default: 1 },
          limit: { type: "integer", default: 10 },
        },
      },
    },
    handler: controller.getAll.bind(controller),
  });

  // GET item by ID
  fastify.get(`/${basePath}/:id`, {
    schema: schema.getById || {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
    handler: controller.getById.bind(controller),
  });

  // POST create item
  fastify.post(`/${basePath}`, {
    schema: schema.create || {},
    handler: controller.create.bind(controller),
  });

  // PUT update item
  fastify.put(`/${basePath}/:id`, {
    schema: schema.update || {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
    handler: controller.update.bind(controller),
  });

  // DELETE item
  fastify.delete(`/${basePath}/:id`, {
    schema: schema.delete || {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
    handler: controller.delete.bind(controller),
  });
}
