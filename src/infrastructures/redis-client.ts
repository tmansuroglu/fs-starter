import Redis from "ioredis"
import { env } from "@config/env"

// TODO: test this is prod
export const redisClient = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  enableOfflineQueue: true,
  maxRetriesPerRequest: null,
  connectTimeout: 10_000,
  reconnectOnError: (err) => {
    return err.message.includes("READONLY")
  },
  // exponential backoff: retry after ~50ms, 100ms, 200ms … up to 2s
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2_000)

    return delay
  },
})

redisClient.on("connect", () => console.log("→ Redis connecting…"))
redisClient.on("ready", () => console.log("→ Redis connected"))
redisClient.on("error", (err) => console.error("Redis error:", err))
redisClient.on("close", () => console.warn("Redis connection closed"))
redisClient.on("reconnecting", () =>
  console.log("Redis attempting to reconnect")
)
