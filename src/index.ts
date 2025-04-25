// src/index.ts
import express, { Request, Response } from "express"
import path from "path"
import http from "http"
import { env, NodeEnvEnum } from "@config/env"
import { htmlHelmet, apiHelmet } from "@config/csp"
import { permissionsPolicyMiddleware } from "@middlewares/permission-policy.middleware"
import pageRouter from "@webRoutes/page.routes"
import apiRouter from "@apiRoutes/auth.routes"
import { errorHandlerMiddleware } from "@middlewares/error-handler.middleware"
import { registerShutdownHooks } from "@utils/shutdown"

// eslint-disable-next-line prefer-const
let server: http.Server

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

registerShutdownHooks(() => server)

// ——————— Web (HTML) router ———————
const web = express.Router()

// apply only to HTML routes & assets
web.use(htmlHelmet, permissionsPolicyMiddleware)

// serve static files under HTML headers
web.use(express.static(path.join(__dirname, "public")))

// parse form submissions only on page routes
web.use(express.urlencoded({ extended: true, limit: "10kb" }))

// your EJS-backed pages
web.use(pageRouter)

// mount at root
app.use("/", web)

// ——————— API (JSON) router ———————
const api = express.Router()

// parse JSON and apply only API headers
api.use(express.json({ limit: "10kb" }), apiHelmet)

// rate limit *only* in production
if (env.nodeEnv === NodeEnvEnum.Production) {
  const {
    rateLimiterMiddleware,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require("@middlewares/rate-limiter.middleware")
  api.use(rateLimiterMiddleware)
}

// your JSON endpoints
api.use(apiRouter)

// mount under /api
app.use("/api", api)

// ——————— 404 catch-all ———————
app.use((req: Request, res: Response) => {
  res.status(404).render("404")
})

// ——————— global error handler ———————
app.use(errorHandlerMiddleware)

// ——————— start server ———————
server = app.listen(env.port, () => {
  const msg =
    env.nodeEnv === NodeEnvEnum.Development
      ? `Server running at http://localhost:${env.port}`
      : "Server is running"
  console.log(msg)
})
