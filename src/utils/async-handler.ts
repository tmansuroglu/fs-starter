import { RequestHandler } from "express"

export const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (fn: (...args: any[]) => Promise<any>): RequestHandler =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
