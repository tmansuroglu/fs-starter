import { validate } from "@middlewares/validation"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionController, deleteSessionController } from "./controllers"
import { apiAuthMiddleware } from "@middlewares/api-auth"

const sessionsRouter = Router()

sessionsRouter.post(
  "/",
  validate(createSessionSchema),
  asyncHandler(createSessionController)
)

sessionsRouter.delete(
  "/",
  apiAuthMiddleware,
  asyncHandler(deleteSessionController)
)

export { sessionsRouter }
