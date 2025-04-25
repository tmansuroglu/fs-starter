/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { AppError } from "@utils/errors"
import { ErrorRequestHandler } from "express"

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    }) as unknown as void
  }

  // TODO: should also log out
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).render("csrf-error", {
      message: "Session expired. Please refresh and try again.",
    }) as unknown as void
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  }) as unknown as void
}
