import express from "express"
import path from "path"
import helmet from "helmet"
import { env } from "@config/env"
import { errorHandlerMiddleware } from "@middlewares/error-handler.middleware"
import pageRouter from "@webRoutes/page.routes"
import apiRouter from "@apiRoutes/auth.routes"

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

// TODO: Warning for safety! https://github.com/animir/node-rate-limiter-flexible/wiki/Express-Middleware

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(helmet({ contentSecurityPolicy: false }))
app.use(helmet.frameguard({ action: "deny" })) // 🛡️ Prevent clickjacking
app.use(helmet.noSniff()) // 🛡️ Block MIME type sniffing
app.use(helmet.hidePoweredBy()) // 🧼 Hides Express signature
app.use(helmet.referrerPolicy({ policy: "no-referrer" })) // 🕵️ Hide referrer
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use("/", htmlCSP, pageRouter)

// TODO: test this in production
if (env.NODE_ENV === "production") {
  import("./middlewares/rate-limiter.middleware")
    .then(({ rateLimiterMiddleware }) => {
      app.use("/api", rateLimiterMiddleware, apiRouter)

      app.use(errorHandlerMiddleware)

      app.listen(env.PORT)
    })
    .catch((err) => {
      console.error("Failed to load rate limiter:", err)
      process.exit(1)
    })
} else {
  app.use("/api", apiRouter)
  app.use(errorHandlerMiddleware)
  app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`)
  })
}
