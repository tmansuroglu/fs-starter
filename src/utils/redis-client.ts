import Redis from "ioredis"
import { env } from "@config/env"

// TODO: test this is prod
export const redisClient = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  enableOfflineQueue: true,
})

redisClient.on("ready", () => console.log("Redis connected"))

redisClient.on("error", (err) => {
  console.log("port", env.redisPort)
  console.log("redisHost", env.redisHost)
  console.error("Redis error", err)
})
