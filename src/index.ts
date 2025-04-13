import express from "express"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Set EJS as view engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

// Define a route
// app.get("/", (req, res) => {
//   res.render("index", { title: "Hello from EJS + TypeScript!" });
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`)
})
