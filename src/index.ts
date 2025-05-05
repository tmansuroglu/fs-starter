import express from "express"
import path from "path"
import { Server } from "http"
import { env } from "@config/env"
import { permissionsPolicyMiddleware } from "@middlewares/permission-policy"
import { apiErrorHandlerMiddleware } from "@middlewares/api-error-handler"
import cookieParser from "cookie-parser"
import csurf from "csurf"
import { injectViewLocalsMiddleware } from "@middlewares/view-locals"
import { rateLimiterMiddleware } from "@middlewares/rate-limiter"
import { sessionMiddleware } from "@middlewares/session"
import { httpsRedirectMiddleware } from "@middlewares/https-redirect"
import { NodeEnvEnum } from "@utils/enums"
import { apiHelmet, htmlHelmet } from "@infrastructures/csp"
import { corsSettings } from "@infrastructures/cors"
import { registerShutdownHooks } from "@infrastructures/shutdown"
import { webRouter } from "@web/router"
import { apiV1Router } from "@api/v1/router"

// TODO: consider this while going prod
// app.set('trust proxy', 1);

// eslint-disable-next-line prefer-const
let server: Server

const app = express()

app.use(httpsRedirectMiddleware)

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
  apiHelmet,
  rateLimiterMiddleware,
  apiV1Router,
  apiErrorHandlerMiddleware
)

// - WEB pipeline -
app.use(
  "/",
  express.urlencoded({ extended: true, limit: "10kb" }),
  htmlHelmet,
  permissionsPolicyMiddleware,
  csurf({ cookie: false }),
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
