import { ValidatedRequest } from "@middlewares/validation"
import { Response } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionService } from "@domains/sessions/services"

type CreateSessionRequest = ValidatedRequest<typeof createSessionSchema>

export const createSessionController = async (
  req: CreateSessionRequest,
  res: Response
) => {
  const { email, password } = req.body

  const { token } = await createSessionService({ email, password })

  return res.status(201).json({
    message: "Successfully created a session.",
    token,
  })
}
