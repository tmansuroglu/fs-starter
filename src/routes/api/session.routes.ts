import { createSessionController } from "@apiControllers/session.controller"
import { validate } from "@middlewares/validation.middleware"
import { createSessionSchema } from "@schemas/session.schema"
import { asyncHandler } from "@utils/async-handler"
import { Router } from "express"

const sessionRouter = Router()

sessionRouter.post(
  "/session",
  validate(createSessionSchema),
  asyncHandler(createSessionController)
)

export default sessionRouter
