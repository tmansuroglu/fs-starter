/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { AppError } from "../utils/errors"

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    }) as unknown as void
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  }) as unknown as void
}
