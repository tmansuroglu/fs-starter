import { loginController } from "@apiControllers/auth.controller"
import { validate } from "@middlewares/validation.middleware"
import { loginSchema } from "@schemas/auth.schema"

import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const apiRouter = Router()

apiRouter.post("/login", validate(loginSchema), asyncHandler(loginController))

export default apiRouter
