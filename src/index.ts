import express from "express"
import path from "path"
import { Server } from "http"
import { env } from "@config/env"
import { permissionsPolicySettings } from "@infrastructures/permission-policy"
import { apiErrorHandlerMiddleware } from "@middlewares/api-error-handler"
import cookieParser from "cookie-parser"
import { injectViewLocalsMiddleware } from "@middlewares/view-locals"
import { rateLimiter } from "@infrastructures/rate-limiter"
import { sessionMiddleware } from "@middlewares/session"
import { httpsRedirect } from "@infrastructures/https-redirect"
import { NodeEnvEnum } from "@utils/enums"
import { apiHelmet, htmlHelmet } from "@infrastructures/csp"
import { corsSettings } from "@infrastructures/cors"
import { registerShutdownHooks } from "@infrastructures/shutdown"
import { webRouter } from "@web/router"
import { apiV1Router } from "@api/v1/router"
import requestId from "express-request-id"
import { pinoLogger } from "@infrastructures/logger"
import { setupSwagger } from "@api/v1/docs/swagger"
import { csurfMiddleware } from "@infrastructures/csurf"

// TODO: consider this while going prod
// app.set('trust proxy', 1);

// eslint-disable-next-line prefer-const
let server: Server

const app = express()

app.set("view cache", true)

setupSwagger(app)

app.use(
  requestId({
    headerName: "x-request-id",
  })
)

app.use(pinoLogger)

app.use(httpsRedirect)

app.use(corsSettings)

app.set("view engine", "ejs")

app.set("views", path.join(__dirname, "web/pages"))

registerShutdownHooks(() => server)

app.use("/", express.static(path.join(__dirname, "web/public")))

app.use(cookieParser(env.sessionSecret))

app.use(sessionMiddleware)

// — API v1 pipeline —
app.use(
  "/api/v1",
  express.json({ limit: "10kb" }),
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
  csurfMiddleware,
  apiHelmet,
  rateLimiter,
  apiV1Router,
  apiErrorHandlerMiddleware
)

// - WEB pipeline -
app.use(
  "/",
  express.urlencoded({ extended: true, limit: "10kb" }),
  htmlHelmet,
  permissionsPolicySettings,
  csurfMiddleware,
  injectViewLocalsMiddleware,
  webRouter
)

server = app.listen(env.port, () => {
  const msg =
    env.nodeEnv === NodeEnvEnum.Development
      ? `Server running at http://localhost:${env.port}`
      : "Server is running"
  console.log(msg)
})
