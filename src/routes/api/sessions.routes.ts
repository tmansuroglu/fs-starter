import { createSessionController } from "@apiControllers/sessions.controller"
import { validate } from "@middlewares/validation.middleware"
import { createSessionSchema } from "@schemas/sessions.schema"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const sessionsRouter = Router()

sessionsRouter.post(
  "/sessions",
  validate(createSessionSchema),
  asyncHandler(createSessionController)
)

export default sessionsRouter
