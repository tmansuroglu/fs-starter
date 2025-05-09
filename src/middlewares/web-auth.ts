import { Request, Response, NextFunction } from "express"

export function webAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return res.status(401).render("unauth", { title: "Ops" })
  }
  next()
}
