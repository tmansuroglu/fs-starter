import { RequestHandler } from "express"

export const httpsRedirectMiddleware: RequestHandler = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(301, `https://${req.headers.host}${req.url}`)
  }

  next()
}
