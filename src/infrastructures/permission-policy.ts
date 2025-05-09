import type { NextFunction, Request, Response } from "express"

export function permissionsPolicySettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.setHeader(
    "Permissions-Policy",
    [
      "fullscreen=(self)",
      "vibrate=()",
      "geolocation=()",
      "camera=()",
      "microphone=()",
      "sync-xhr=()",
      "interest-cohort=()",
    ].join(", ")
  )
  next()
}
