import { validate } from "@middlewares/validation"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"
import { CreateUserRequestSchema } from "./schemas"
import { createUserController } from "./controllers"

const usersRouter = Router()

usersRouter.post(
  "/",
  validate(CreateUserRequestSchema),
  asyncHandler(createUserController)
)

export { usersRouter }
