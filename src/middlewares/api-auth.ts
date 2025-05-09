import { Request, Response, NextFunction } from "express"
import { UnauthorizedError } from "@errors/custom-errors"

export function apiAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    throw new UnauthorizedError({ message: "Not authenticated." })
  }
  next()
}
