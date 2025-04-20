import { RequestHandler } from "express"

export const renderHomePage: RequestHandler = (req, res) => {
  res.render("layout", { title: "This will be my portfolio", page: "home" })
}

export const renderAdminPage: RequestHandler = (req, res) => {
  res.render("layout", { title: "This will be my admin page", page: "admin" })
}

export const renderLoginPage: RequestHandler = (req, res) => {
  res.render("layout", { title: "Login", page: "login" })
}
