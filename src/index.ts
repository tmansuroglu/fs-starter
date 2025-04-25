import express from "express"
import path from "path"
import helmet from "helmet"
import { env, NodeEnvEnum } from "@config/env"
import { errorHandlerMiddleware } from "@middlewares/error-handler.middleware"
import pageRouter from "@webRoutes/page.routes"
import apiRouter from "@apiRoutes/auth.routes"
import http from "http"
import { db } from "@config/db"

const htmlCSP = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // all resources must come from your domain
    scriptSrc: ["'self'"], // no inline scripts, no external JS
    styleSrc: ["'self'"], // no inline styles, no external CSS
    fontSrc: ["'self'"], // only self-hosted fonts
    imgSrc: ["'self'"], // no base64 or remote images
    objectSrc: ["'none'"], // disable <object>, <embed>, etc.
    frameAncestors: ["'none'"], // block embedding in iframes (clickjacking)
    baseUri: ["'self'"], // restrict <base href="">
    connectSrc: ["'self'"], // allow fetch/XHR only to your own domain
    formAction: ["'self'"], // forms can only post to your own server
    upgradeInsecureRequests: [], // auto-upgrades HTTP -> HTTPS for all subresources
  },
})

// eslint-disable-next-line prefer-const
let server: http.Server
/**
 * Installs SIGINT, SIGTERM, uncaughtException, unhandledRejection
 * handlers that will call `.close()` on whatever server you provide,
 * then disconnect Prisma, then exit.
 */
// TODO: test his
function registerShutdownHooks(getServer: () => http.Server | undefined) {
  async function shutdown(signal: string) {
    console.log(`\nReceived ${signal}. Shutting down…`)
    const srv = getServer()
    if (srv) {
      // stop accepting new connections, wait for existing ones
      await new Promise<void>((resolve) => srv.close(() => resolve()))
    }
    // clean up Prisma
    await db.$disconnect()
    console.log("Cleanup finished, exiting.")
    process.exit(0)
  }

  process.on("SIGINT", () => shutdown("SIGINT"))
  process.on("SIGTERM", () => shutdown("SIGTERM"))
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err)
    shutdown("uncaughtException")
  })
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason)
    shutdown("unhandledRejection")
  })
}

const app = express()

registerShutdownHooks(() => server)

// TODO: Warning for safety! https://github.com/animir/node-rate-limiter-flexible/wiki/Express-Middleware

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.json({ limit: "10kb" }))

// TODO: different helmet for api and web
app.use(helmet({ contentSecurityPolicy: false }))
app.use(helmet.frameguard({ action: "deny" })) // 🛡️ Prevent clickjacking
app.use(helmet.noSniff()) // 🛡️ Block MIME type sniffing
app.use(helmet.hidePoweredBy()) // 🧼 Hides Express signature
app.use(helmet.referrerPolicy({ policy: "no-referrer" })) // 🕵️ Hide referrer
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use("/", htmlCSP, pageRouter)

// TODO: test this in production
if (env.nodeEnv === NodeEnvEnum.Production) {
  const {
    rateLimiterMiddleware,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require("@middlewares/rate-limiter.middleware")
  app.use("/api", rateLimiterMiddleware, apiRouter)
} else {
  app.use("/api", apiRouter)
}

app.use(errorHandlerMiddleware)

server = app.listen(env.port, () => {
  if (env.nodeEnv === NodeEnvEnum.Development) {
    console.log(`Server is running at http://localhost:${env.port}`)
  } else {
    console.log("Server is running")
  }
})
