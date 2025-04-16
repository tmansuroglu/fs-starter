import express from "express"
import path from "path"
import pageRouter from "./routes/web/page.routes"
import { env } from "./config/env"
import rateLimiterMiddleware from "./middlewares/rate-limiter.middleware"

const app = express()

// TODO: Warning for safety!
// https://github.com/animir/node-rate-limiter-flexible/wiki/Express-Middleware

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(rateLimiterMiddleware)
app.use("/", pageRouter)

app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`)
})
