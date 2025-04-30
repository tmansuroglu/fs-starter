type AppErrorOptions = {
  message?: string
  errors?: Record<string, string>
  statusCode?: number
  isOperational?: boolean
  retryAfter?: string
}

export class AppError extends Error {
  statusCode: number
  isOperational: boolean
  errors?: Record<string, string>
  retryAfter?: string

  constructor({
    message = "An error occurred",
    errors,
    statusCode = 500,
    isOperational = true,
    retryAfter,
  }: AppErrorOptions) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors

    if (retryAfter) this.retryAfter = retryAfter

    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor({
    message = "Resource not found",
    errors,
  }: AppErrorOptions = {}) {
    super({ message, statusCode: 404, errors })
  }
}

export class BadRequestError extends AppError {
  constructor({ message = "Bad request", errors }: AppErrorOptions = {}) {
    super({ message, statusCode: 400, errors })
  }
}

export class UnauthorizedError extends AppError {
  constructor({ message = "Unauthorized", errors }: AppErrorOptions = {}) {
    super({ message, statusCode: 401, errors })
  }
}

export class ForbiddenError extends AppError {
  constructor({ message = "Forbidden", errors }: AppErrorOptions = {}) {
    super({ message, statusCode: 403, errors })
  }
}

export class InternalServerError extends AppError {
  constructor({
    message = "Internal Server Error",
    errors,
  }: AppErrorOptions = {}) {
    super({ message, statusCode: 500, isOperational: false, errors })
  }
}

export class TooManyRequestError extends AppError {
  constructor({
    message = "Too many requests. Try again later.",
    retryAfter,
    errors,
  }: AppErrorOptions = {}) {
    super({
      message,
      statusCode: 429,
      retryAfter,
      errors,
    })
  }
}

export class InvalidIpError extends AppError {
  constructor({ message = "Invalid IP" }: AppErrorOptions = {}) {
    super({
      message,
      statusCode: 400,
    })
  }
}

export class CorsError extends AppError {
  constructor({ message = "Cors Error" }: AppErrorOptions = {}) {
    super({
      message,
      statusCode: 403,
    })
  }
}
