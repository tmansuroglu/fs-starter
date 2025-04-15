import express from "express"
import path from "path"
import pageRouter from "./routes/web/page.routes"
import { env } from "./config/env"

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", pageRouter)

app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`)
})
