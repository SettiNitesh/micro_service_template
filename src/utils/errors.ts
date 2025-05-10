import { FastifyReply, FastifyRequest } from "fastify";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, 429);
  }
}
export class TimeoutError extends AppError {
  constructor(message: string) {
    super(message, 504);
  }
}
export class NotImplementedError extends AppError {
  constructor(message: string) {
    super(message, 501);
  }
}
export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message, 503);
  }
}
export class DatabaseConnectionError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
export class QueryError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

export const errorHandler = (
  err: AppError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  req.log.error(err);

  // Set the response status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send the response
  return reply.status(statusCode).send({
    status: "error",
    statusCode,
    message,
  });
};
