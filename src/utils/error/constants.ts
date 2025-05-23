const STATUS_TEXTS = {
  400: 'Bad request parameters',
  401: 'Bad or expired token',
  403: 'Insufficient permissions to perform an operation over a resource',
  404: 'Resource Not Found',
  405: 'Method not allowed',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

const STATUS_CODES = {
  301: 'MOVED_PERMANENTLY',
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'REQUEST_FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'TOO_MANY_REQUEST',
  405: 'METHOD_NOT_ALLOWED',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT',
  ECONNRESET: 'ECONNRESET'
};

const POSTGRES_DB_ERRORS = {
  23502: { statusCode: 400, errorCode: 'NOT_NULL_VIOLATION' },
  23503: { statusCode: 400, errorCode: 'FOREIGN_KEY_VIOLATION' },
  23505: { statusCode: 409, errorCode: 'UNIQUE_KEY_VIOLATION' },
  23514: { statusCode: 400, errorCode: 'INVALID_VALUE' }
};

const ERROR_LOGGING_MESSAGES = {
  fatal: 'Fatal: Unhandled Error',
  paramsValidation: 'Validation Error: Schema Validation Error',
  badRequest: 'Validation Error: Bad Request',
  connectionError: 'Validation Error: DB Connection Error',
  postgresError: 'Validation Error: Postgres Error'
};

export { ERROR_LOGGING_MESSAGES, POSTGRES_DB_ERRORS, STATUS_CODES, STATUS_TEXTS };
