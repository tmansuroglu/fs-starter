import { Prisma } from "@generated-prisma"
import { errorResponder } from "@utils/error-responder"
import { AppError } from "@utils/errors"
import {
  formatPrismaError,
  getPrismaErrorStatus,
  PrismaErrorCode,
} from "@utils/prisma-error-utils"
import { ErrorRequestHandler } from "express"

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  const isPrismaEngineError =
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientValidationError ||
    err instanceof Prisma.PrismaClientUnknownRequestError

  if (isPrismaEngineError) {
    errorResponder({
      res,
      statusCode: 500,
      message: `Prisma engine error ${err.name}`,
    })

    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    errorResponder({
      res,
      statusCode: getPrismaErrorStatus(err.code as PrismaErrorCode),
      message: formatPrismaError(err),
    })

    return
  }

  if (err instanceof AppError) {
    errorResponder({
      res,
      message: err.message,
      fieldErrors: err.errors,
      statusCode: err.statusCode,
    })
    return
  }

  // TODO: should also log out
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).render("csrf-error", {
      message: "Session expired. Please refresh and try again.",
    })

    return
  }

  if (
    err instanceof SyntaxError &&
    "body" in err &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).type === "entity.parse.failed"
  ) {
    errorResponder({
      res,
      message: "Invalid JSON payload.",
      statusCode: 400,
    })

    return
  }

  errorResponder({
    res,
    message: "Something went wrong",
    statusCode: 500,
  })
}
