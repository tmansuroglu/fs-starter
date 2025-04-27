import {
  loginController,
  registerController,
} from "@apiControllers/auth.controller"
import { validate } from "@middlewares/validation.middleware"
import { loginSchema, registerSchema } from "@schemas/auth.schema"

import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const apiRouter = Router()

apiRouter.post("/login", validate(loginSchema), asyncHandler(loginController))

apiRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(registerController)
)

export default apiRouter
