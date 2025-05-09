import { RequestHandler } from "express"

export const renderHomePage: RequestHandler = (req, res) => {
  res.render("layout", {
    title: "Home page",
    page: "home",
    stylesheets: [],
  })
}

export const renderRegisterPage: RequestHandler = (req, res) => {
  res.render("layout", {
    title: "Register",
    page: "register",
    stylesheets: ["/css/register.css"],
  })
}

export const renderLoginPage: RequestHandler = (req, res) => {
  res.render("layout", {
    title: "Login",
    page: "login",
    stylesheets: ["/css/login.css"],
  })
}

export const renderAdminPage: RequestHandler = (req, res) => {
  res.render("layout", {
    title: "Admin page",
    page: "admin",
    stylesheets: [],
  })
}
