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
import csurf from "csurf"
import { injectViewLocals } from "@middlewares/view-locals.middleware"
import { rateLimiterMiddleware } from "@middlewares/rate-limiter.middleware"
import { sessionMiddleware } from "@middlewares/session.middleware"
import { corsMiddleware } from "@config/cors"
import { httpsRedirectMiddleware } from "@middlewares/https-redirect.middleware"

// TODO: consider this while going prod
// app.set('trust proxy', 1);

// eslint-disable-next-line prefer-const
let server: http.Server

const app = express()

app.use(httpsRedirectMiddleware)

app.use(corsMiddleware)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

registerShutdownHooks(() => server)

app.use(cookieParser(process.env.SESSION_SECRET))

app.use(sessionMiddleware)

// ——————— API router ———————
const api = express.Router()

api.use(express.json({ limit: "10kb" }), apiHelmet)
api.use(express.urlencoded({ extended: true, limit: "10kb" }))

if (env.nodeEnv === NodeEnvEnum.Production) {
  api.use(rateLimiterMiddleware)
}

api.use(apiRouter)

app.use("/api", api)

// ——————— Web (HTML) router ———————
const web = express.Router()

web.use(csurf({ cookie: false }))

web.use(injectViewLocals)

web.use(htmlHelmet, permissionsPolicyMiddleware)

web.use(express.static(path.join(__dirname, "public")))

web.use(express.urlencoded({ extended: true, limit: "10kb" }))

web.use(pageRouter)

app.use("/", web)

// ——————— 404 catch-all ———————
app.use((req: Request, res: Response) => {
  res.status(404).render("404")
})

app.use(errorHandlerMiddleware)

server = app.listen(env.port, () => {
  const msg =
    env.nodeEnv === NodeEnvEnum.Development
      ? `Server running at http://localhost:${env.port}`
      : "Server is running"
  console.log(msg)
})
