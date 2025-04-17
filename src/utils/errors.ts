type AppErrorOptions = {
  message?: string
  statusCode?: number
  isOperational?: boolean
  retryAfter?: string
}

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor({
    message = undefined,
    statusCode = 500,
    isOperational = true,
  }: AppErrorOptions) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor({ message = "Resource not found" }: AppErrorOptions = {}) {
    super({ message, statusCode: 404 })
  }
}

export class BadRequestError extends AppError {
  constructor({ message = "Bad request" }: AppErrorOptions = {}) {
    super({ message, statusCode: 400 })
  }
}

export class UnauthorizedError extends AppError {
  constructor({ message = "Unauthorized" }: AppErrorOptions = {}) {
    super({ message, statusCode: 401 })
  }
}

export class ForbiddenError extends AppError {
  constructor({ message = "Forbidden" }: AppErrorOptions = {}) {
    super({ message, statusCode: 403 })
  }
}

export class InternalServerError extends AppError {
  constructor({ message = "Internal Server Error" }: AppErrorOptions = {}) {
    super({ message, statusCode: 500, isOperational: false })
  }
}

export class TooManyRequestError extends AppError {
  constructor({
    message = "Too many requests. Try again later.",
    retryAfter,
  }: AppErrorOptions = {}) {
    super({
      message,
      statusCode: 429,
      retryAfter,
    })
  }
}
