// fastify.d.ts
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    requestTime?: number;
    logTrace?: Record<string, string>;
  }
}
