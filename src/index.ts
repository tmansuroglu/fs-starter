import express from "express"
import path from "path"
import pageRouter from "./routes/web/page.routes"
import { env } from "./config/env"
import helmet from "helmet"
import apiRouter from "./routes/api/auth.routes"
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware"

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

const app = express()

// TODO: add csrf protection
// TODO: add cors
// TODO: add auth middleware for route guarding
// TODO: Warning for safety! https://github.com/animir/node-rate-limiter-flexible/wiki/Express-Middleware

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(helmet.frameguard({ action: "deny" })) // 🛡️ Prevent clickjacking
app.use(helmet.noSniff()) // 🛡️ Block MIME type sniffing
app.use(helmet.hidePoweredBy()) // 🧼 Hides Express signature
app.use(helmet.referrerPolicy({ policy: "no-referrer" })) // 🕵️ Hide referrer
app.use("/", htmlCSP, pageRouter)

// TODO: test this in production
if (env.NODE_ENV === "production") {
  const {
    rateLimiterMiddleware,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require("./middlewares/rate-limiter.middleware")
  app.use("/api", rateLimiterMiddleware, apiRouter)
} else {
  app.use("/api", apiRouter)
}

app.use(errorHandlerMiddleware)

app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`)
})
