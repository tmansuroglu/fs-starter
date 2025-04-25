import { env } from "@config/env"
import type { Request, Response, NextFunction } from "express"

export function injectViewLocals(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.csrfToken = req.csrfToken()

  res.locals.env = env.nodeEnv

  next()
}
