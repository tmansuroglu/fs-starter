import { Router } from "express"
import { loginController } from "../../controllers/api/auth.controller"
import { asyncHandler } from "../../utils/async-handler"

const apiRouter = Router()

apiRouter.post("/login", asyncHandler(loginController))

export default apiRouter
