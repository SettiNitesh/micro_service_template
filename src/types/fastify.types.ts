import { FastifyRequest } from "fastify";

export interface FastifyRequestExtended extends FastifyRequest {
  requestTime?: number;
}
