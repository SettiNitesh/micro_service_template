import { FastifyReply, FastifyRequest } from "fastify";
import { BaseService } from "../services/base.service";
import { Entity, Filters, PaginationOptions } from "../types";

export class BaseController<T extends Entity> {
  protected service: BaseService<T>;

  constructor(service: BaseService<T>) {
    this.service = service;
  }

  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { page = 1, limit = 10, ...filters } = request.query as any;

      const pagination: PaginationOptions = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const result = await this.service.getAll(filters as Filters, pagination);

      return reply.code(200).send({
        success: true,
        ...result,
      });
    } catch (error) {
      request.log.error(error);
      throw error;
    }
  }

  async getById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params as { id: string };

      const data = await this.service.getById(id);

      return reply.code(200).send({
        success: true,
        data,
      });
    } catch (error) {
      request.log.error(error);
      throw error;
    }
  }

  async create(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const data = await this.service.create(request.body as Partial<T>);

      return reply.code(201).send({
        success: true,
        data,
      });
    } catch (error) {
      request.log.error(error);
      throw error;
    }
  }

  async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params as { id: string };

      const data = await this.service.update(id, request.body as Partial<T>);

      return reply.code(200).send({
        success: true,
        data,
      });
    } catch (error) {
      request.log.error(error);
      throw error;
    }
  }

  async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { id } = request.params as { id: string };

      await this.service.delete(id);

      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      throw error;
    }
  }
}
