import { FastifyReply, FastifyRequest } from "fastify";

const request = (req: FastifyRequest) => {
  return {
    url: req.url,
    method: req.method,
    query_params: req.query,
    body: req.body,
    raw_headers: req.headers,
  };
};

export const requestLogging = (
  req: FastifyRequest,
  _rep: FastifyReply,
  done: any
) => {
  req.log.info({
    message: "Incoming Request",
    log_trace: req.logTrace,
    request: request(req),
  });

  done();
};

export const responseLogging = (
  req: FastifyRequest,
  rep: FastifyReply,
  done: any
) => {
  req.log.info({
    message: "Server Response",
    log_trace: req.logTrace,
    request: request(req),
    response: {
      status_code: rep.statusCode,
      response_time: rep.elapsedTime,
    },
  });

  done();
};

const buildLogTrace = async (req: FastifyRequest, ...headers: string[]) => {
  return headers.reduce((logTrace, header) => {
    return Object.assign(
      logTrace,
      req.headers[header] && { [header]: req.headers[header] }
    );
  }, {});
};

export const extractLogTrace = async (
  req: FastifyRequest,
  _rep: FastifyReply
) => {
  const logTrace = await buildLogTrace(
    req,
    "x-request-id",
    "x-channel-id",
    "x-b3-traceid",
    "x-device-id",
    "x-app-version",
    "x-user-journey-id",
    "x-b3-spanid",
    "x-b3-parentspanid",
    "x-b3-sampled",
    "x-ot-span-context",
    "x-b3-flags"
  );
  req.logTrace = logTrace;
};
