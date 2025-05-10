import { env } from "@config/env"
import { NodeEnvEnum } from "@utils/enums"
import type { Request, Response, NextFunction } from "express"

export function injectViewLocalsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.csrfToken =
    env.nodeEnv === NodeEnvEnum.Production ? req.csrfToken() : null

  res.locals.env = env.nodeEnv

  next()
}
