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
import cookieParser from "cookie-parser"
import session from "express-session"
import csurf from "csurf"
import { injectViewLocals } from "@middlewares/view-locals.middleware"
import { redisClient } from "@utils/redis-client"
import { RedisStore } from "connect-redis"
import { rateLimiterMiddleware } from "@middlewares/rate-limiter.middleware"

// eslint-disable-next-line prefer-const
let server: http.Server

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

registerShutdownHooks(() => server)

app.use(cookieParser(process.env.SESSION_SECRET))

const sessionOptions: session.SessionOptions = {
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === NodeEnvEnum.Production,
  },
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:",
    ttl: 60 * 60 * 24,
  }),
}

app.use(session(sessionOptions))

// ——————— API router ———————
const api = express.Router()

// parse JSON and apply only API headers
api.use(express.json({ limit: "10kb" }), apiHelmet)
api.use(express.urlencoded({ extended: true, limit: "10kb" }))

if (env.nodeEnv === NodeEnvEnum.Production) {
  api.use(rateLimiterMiddleware)
}

// your JSON endpoints
api.use(apiRouter)

// mount under /api
app.use("/api", api)

// ——————— Web (HTML) router ———————
const web = express.Router()

web.use(csurf({ cookie: false }))

web.use(injectViewLocals)

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
