import express from "express"
import path from "path"
import dotenv from "dotenv"
import pageRouter from "./routes/web/page.routes"

dotenv.config()

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", pageRouter)

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
})
