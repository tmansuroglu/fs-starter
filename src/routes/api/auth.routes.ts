import { loginController } from "@apiControllers/auth.controller"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const apiRouter = Router()

apiRouter.post("/login", asyncHandler(loginController))

export default apiRouter
