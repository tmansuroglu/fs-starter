import { cookieOptions } from "@config/cookie-options"
import { env } from "@config/env"
import { NodeEnvEnum } from "@utils/enums"
import csurf from "csurf"
import { RequestHandler } from "express"

const csrfProtect = csurf({ cookie: { ...cookieOptions, key: "XSRF-TOKEN" } })

export const csurfMiddleware: RequestHandler = (req, res, next) => {
  if (env.nodeEnv === NodeEnvEnum.Development) {
    return next()
  }

  return csrfProtect(req, res, next)
}
