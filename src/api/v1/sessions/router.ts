import { validate } from "@middlewares/validation"
import { asyncHandlerMiddleware } from "@middlewares/async-handler"
import { Router } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionController } from "./controllers"

const sessionsRouter = Router()

sessionsRouter.post(
  "/",
  validate(createSessionSchema),
  asyncHandlerMiddleware(createSessionController)
)

export { sessionsRouter }
