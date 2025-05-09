import { validate } from "@middlewares/validation"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"
import { createUserSchema } from "./schemas"
import { createUserController } from "./controllers"

const usersRouter = Router()

usersRouter.post(
  "/",
  validate(createUserSchema),
  asyncHandler(createUserController)
)

export { usersRouter }
