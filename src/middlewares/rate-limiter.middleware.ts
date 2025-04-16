import { RequestHandler } from "express"
import Redis from "ioredis"
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible"

const redisClient = new Redis({ enableOfflineQueue: false })

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 5,
  duration: 60,
  useRedisPackage: true,
})

const rateLimiterMiddleware: RequestHandler = (req, res, next) => {
  if (!req.ip) {
    res.status(400).json({ message: "Invalid request: IP address not found." })
    return
  }

  rateLimiter
    .consume(req.ip)
    .then(next)
    .catch((rateLimiterRes: RateLimiterRes) => {
      res.status(429).json({
        message: "Too many requests. Try again later.",
        retryAfter: rateLimiterRes.msBeforeNext / 1000 + "s",
      })
    })
}

export default rateLimiterMiddleware
