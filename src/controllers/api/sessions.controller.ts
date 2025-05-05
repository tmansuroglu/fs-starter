import { ValidatedRequest } from "@middlewares/validation.middleware"
import { createSessionSchema } from "@schemas/sessions.schema"
import { createSessionService } from "@services/sessions.services"
import { Response } from "express"

type CreateSessionRequest = ValidatedRequest<typeof createSessionSchema>

export const createSessionController = async (
  req: CreateSessionRequest,
  res: Response
) => {
  const { email, password } = req.body

  const { token } = await createSessionService({ email, password })

  return res.status(201).json({
    message: "Successfully created session.",
    token,
  })
}
