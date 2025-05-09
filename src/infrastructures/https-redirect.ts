import { env } from "@config/env"
import { NodeEnvEnum } from "@utils/enums"
import { RequestHandler } from "express"

export const httpsRedirect: RequestHandler = (req, res, next) => {
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    env.nodeEnv === NodeEnvEnum.Production
  ) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`)
  }

  return next()
}
