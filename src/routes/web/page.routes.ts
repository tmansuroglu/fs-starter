import express from "express"
import {
  renderAdminPage,
  renderHomePage,
} from "../../controllers/web/page.controllers"

const pageRouter = express.Router()

pageRouter.get("/", renderHomePage)

pageRouter.get("/admin", renderAdminPage)

export default pageRouter
