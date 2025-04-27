import { RequestHandler } from "express"

export const renderHomePage: RequestHandler = (req, res) => {
  res.render("layout", {
    title: "This will be my portfolio",
    page: "home",
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
