import { createUserController } from "@apiControllers/users.controller"
import { validate } from "@middlewares/validation.middleware"
import { createUserSchema } from "@schemas/users.schema"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const userRouter = Router()

userRouter.post(
  "/users",
  validate(createUserSchema),
  asyncHandler(createUserController)
)

export default userRouter
