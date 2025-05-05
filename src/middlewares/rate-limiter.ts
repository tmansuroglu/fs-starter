import { RequestHandler } from "express"
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible"
import { env } from "@config/env"
import { NodeEnvEnum } from "@utils/enums"
import { InvalidIpError, TooManyRequestError } from "@errors/custom-errors"
import { redisClient } from "@infrastructures/redis-client"

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 5,
  duration: 60,
  useRedisPackage: true,
})

export const rateLimiterMiddleware: RequestHandler = async (req, res, next) => {
  if (env.nodeEnv !== NodeEnvEnum.Production) {
    return next()
  }

  const ip = req.ip
  if (!ip) {
    return next(new InvalidIpError())
  }

  try {
    await rateLimiter.consume(ip)
    return next()
  } catch (rlRes) {
    const retrySeconds = Math.ceil(
      (rlRes as RateLimiterRes).msBeforeNext / 1000
    )
    const err = new TooManyRequestError({
      retryAfter: `${retrySeconds}`,
    })

    res.set("Retry-After", String(retrySeconds))
    return next(err)
  }
}
