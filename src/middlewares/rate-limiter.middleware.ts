import { InvalidIpError, TooManyRequestError } from "@utils/errors-classes"
import { redisClient } from "@config/redis-client"
import { RequestHandler } from "express"
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible"

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 5,
  duration: 60,
  useRedisPackage: true,
})

export const rateLimiterMiddleware: RequestHandler = (req, res, next) => {
  if (!req.ip) {
    throw new InvalidIpError()
  }

  rateLimiter
    .consume(req.ip)
    .then(next)
    .catch((rateLimiterRes: RateLimiterRes) => {
      throw new TooManyRequestError({
        retryAfter: rateLimiterRes.msBeforeNext / 1000 + "s",
      })
    })
}
