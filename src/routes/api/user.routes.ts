import { createUserController } from "@apiControllers/user.controller"
import { validate } from "@middlewares/validation.middleware"
import { createUserSchema } from "@schemas/user.schema"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const userRouter = Router()

userRouter.post(
  "/user",
  validate(createUserSchema),
  asyncHandler(createUserController)
)

export default userRouter
