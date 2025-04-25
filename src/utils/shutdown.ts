import http from "http"
import { db } from "@config/db"
import { redisClient } from "../config/redis-client"

export function registerShutdownHooks(
  getServer: () => http.Server | undefined
) {
  let isShuttingDown = false

  async function shutdown(signal: string) {
    if (isShuttingDown) return // prevents double-shutdown if multiple events fire
    isShuttingDown = true

    console.log(`\nReceived ${signal}. Beginning graceful shutdown…`)
    // force-exit after 10s in case close/disconnect hang
    const forcedExit = setTimeout(() => {
      console.error("Could not close connections in time, forcing exit.")
      process.exit(1)
    }, 10_000)

    try {
      const srv = getServer()
      if (srv) {
        // stop accepting new connections and wait for existing ones
        await new Promise<void>((resolve) => srv.close(() => resolve()))
      }
      // disconnect your DB after HTTP server closed
      await db.$disconnect()
      console.log("Cleanup finished, exiting cleanly.")
      clearTimeout(forcedExit)
      await redisClient.quit()
      process.exit(0)
    } catch (err) {
      console.error("Error during shutdown:", err)
      clearTimeout(forcedExit)
      process.exit(1)
    }
  }

  // listen only once per event to avoid duplicate runs
  process.once("SIGINT", () => shutdown("SIGINT"))
  process.once("SIGTERM", () => shutdown("SIGTERM"))
  process.once("uncaughtException", (err) => {
    console.error("Uncaught exception:", err)
    shutdown("uncaughtException")
  })
  process.once("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason)
    shutdown("unhandledRejection")
  })
}
