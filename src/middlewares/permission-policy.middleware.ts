import type { NextFunction, Request, Response } from "express"

export function permissionsPolicyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // sets a Permissions-Policy header disabling unused APIs like camera, geolocation, and synchronous XHR to harden your pages against feature abuse
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
