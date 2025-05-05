import { validate } from "@middlewares/validation"
import { asyncHandlerMiddleware } from "@middlewares/async-handler"
import { Router } from "express"
import { createUserSchema } from "./schemas"
import { createUserController } from "./controllers"

const usersRouter = Router()

usersRouter.post(
  "/",
  validate(createUserSchema),
  asyncHandlerMiddleware(createUserController)
)

export { usersRouter }
