import Redis from "ioredis"
import { env } from "@config/env"

// TODO: test this is prod
// TODO: should i move this to config?
export const redisClient = new Redis({
  host: env.redisHost,
  port: env.redisPort,
  enableOfflineQueue: true,
  password: env.redisPassword,
  maxRetriesPerRequest: null,
  reconnectOnError: (err) => {
    // only reconnect on certain errors
    return err.message.includes("READONLY")
  },
  connectTimeout: 10_000,
})

redisClient.on("ready", () => console.log("Redis connected"))

redisClient.on("error", (err) => {
  console.log("port", env.redisPort)
  console.log("redisHost", env.redisHost)
  console.error("Redis error", err)
})
