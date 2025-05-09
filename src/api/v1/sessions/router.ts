import { validate } from "@middlewares/validation"
import { asyncHandlerMiddleware } from "@middlewares/async-handler"
import { Router } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionController, deleteSessionController } from "./controllers"
import { apiAuthMiddleware } from "@middlewares/api-auth"

const sessionsRouter = Router()

sessionsRouter.post(
  "/",
  validate(createSessionSchema),
  asyncHandlerMiddleware(createSessionController)
)

sessionsRouter.delete(
  "/",
  apiAuthMiddleware,
  asyncHandlerMiddleware(deleteSessionController)
)

export { sessionsRouter }
