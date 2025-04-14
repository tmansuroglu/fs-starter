import { RequestHandler } from "express"

export const renderHomePage: RequestHandler = (req, res) => {
  res.render("home", { title: "This will be my portfolio" })
}

export const renderAdminPage: RequestHandler = (req, res) => {
  res.render("admin", { title: "This will be my admin page" })
}
