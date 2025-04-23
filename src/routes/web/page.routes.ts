import {
  renderAdminPage,
  renderHomePage,
  renderLoginPage,
} from "@webControllers/page.controllers"
import express from "express"

const pageRouter = express.Router()

pageRouter.get("/", renderHomePage)

pageRouter.get("/admin", renderAdminPage)

pageRouter.get("/login", renderLoginPage)

export default pageRouter
