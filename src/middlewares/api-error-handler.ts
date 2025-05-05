import { Prisma } from "@generated-prisma"
import { ErrorRequestHandler } from "express"
import {
  formatPrismaError,
  getPrismaErrorStatus,
  PrismaErrorCode,
} from "@errors/prisma-errors"
import { AppError } from "@errors/custom-errors"
import { apiErrorResponder } from "@utils/api-error-responder"

export const apiErrorHandlerMiddleware: ErrorRequestHandler = (
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
    apiErrorResponder({
      res,
      statusCode: 500,
      message: `Prisma engine error ${err.name}`,
    })

    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    apiErrorResponder({
      res,
      statusCode: getPrismaErrorStatus(err.code as PrismaErrorCode),
      message: formatPrismaError(err),
    })

    return
  }

  if (err instanceof AppError) {
    apiErrorResponder({
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
    apiErrorResponder({
      res,
      message: "Invalid JSON payload.",
      statusCode: 400,
    })

    return
  }

  apiErrorResponder({
    res,
    message: "Something went wrong",
    statusCode: 500,
  })
}
