import { validate } from "@middlewares/validation"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"
import { CreateSessionRequestSchema } from "./schemas"
import { createSessionController, deleteSessionController } from "./controllers"
import { apiAuthMiddleware } from "@middlewares/api-auth"

const sessionsRouter = Router()

sessionsRouter.post(
  "/",
  validate(CreateSessionRequestSchema),
  asyncHandler(createSessionController)
)

sessionsRouter.delete(
  "/",
  apiAuthMiddleware,
  asyncHandler(deleteSessionController)
)

export { sessionsRouter }
