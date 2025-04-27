import {
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
} from "@webControllers/page.controllers"
import express from "express"

const pageRouter = express.Router()

pageRouter.get("/", renderHomePage)

pageRouter.get("/register", renderRegisterPage)

pageRouter.get("/login", renderLoginPage)

export default pageRouter
