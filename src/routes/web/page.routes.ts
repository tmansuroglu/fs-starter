import express from "express"
import {
  renderAdminPage,
  renderHomePage,
  renderLoginPage,
} from "../../controllers/web/page.controllers"

const pageRouter = express.Router()

pageRouter.get("/", renderHomePage)

pageRouter.get("/admin", renderAdminPage)

pageRouter.get("/login", renderLoginPage)

export default pageRouter
