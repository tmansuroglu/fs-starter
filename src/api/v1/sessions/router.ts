import { validate } from "@middlewares/validation"
import { asyncHandlerMiddleware } from "@middlewares/async-handler"
import { Router } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionController, deleteSessionController } from "./controllers"
import { authMiddleware } from "@middlewares/auth"

const sessionsRouter = Router()

sessionsRouter.post(
  "/",
  validate(createSessionSchema),
  asyncHandlerMiddleware(createSessionController)
)

sessionsRouter.delete(
  "/",
  authMiddleware,
  asyncHandlerMiddleware(deleteSessionController)
)

export { sessionsRouter }
