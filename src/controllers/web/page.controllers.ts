import { RequestHandler } from "express"

export const renderHomePage: RequestHandler = (req, res) => {
  res.render("home", { title: "Hello from EJS + TypeScript!" })
}
