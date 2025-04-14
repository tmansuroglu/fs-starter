import express from "express"
import { renderHomePage } from "../../controllers/web/page.controllers"

const pageRouter = express.Router()

pageRouter.get("/", renderHomePage)

export default pageRouter
