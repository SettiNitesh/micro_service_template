import { FastifyReply, FastifyRequest } from "fastify";
import CustomError from "./custom.error";
import { getError, getRequest } from "./helper";
import { DEFAULT_MAPPERS } from "./mappers";

function errorHandler(options?: any, mappers = DEFAULT_MAPPERS) {
  return async function ErrorHandler(
    error: unknown,
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    for (const mapper of mappers) {
      const resp = mapper(error, options);
      if (resp) {
        if (!(request?.raw?.method === "GET" && resp.code === 404)) {
          request.log.error({
            request: getRequest(request),
            error: getError(error),
            log_trace: request.logTrace,
            message: "Error while processing request",
          });
        }
        return reply.code(resp.code || 500).send(resp.response);
      }
    }

    request.log.error({
      request: getRequest(request),
      error: getError(error),
      log_trace: request.logTrace,
      message: "Error while processing request",
    });

    const unhandledError = CustomError.create({
      httpCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "INTERNAL_SERVER_ERROR",
    });

    return reply.code(unhandledError.code || 500).send(unhandledError.response);
  };
}

export default errorHandler;
