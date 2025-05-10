import { ValidatedRequest } from "@middlewares/validation"
import { Request, Response } from "express"
import { CreateSessionRequestSchema, CreateSessionResponse } from "./schemas"
import { createSessionService } from "@domains/sessions/services"
import { destroySession, regenerateSession } from "@utils/session-utils"
import { SESSION_NAME } from "@utils/constants"

type CreateSessionRequest = ValidatedRequest<typeof CreateSessionRequestSchema>

export const createSessionController = async (
  req: CreateSessionRequest,
  res: Response
) => {
  const { email, password } = req.body

  const { user } = await createSessionService({
    email,
    password,
  })

  await regenerateSession(req)

  req.session.userId = user.id

  const payload: CreateSessionResponse = {
    message: "Successfully created a session.",
    user,
  }

  return res.status(201).json(payload)
}

export const deleteSessionController = async (req: Request, res: Response) => {
  await destroySession(req)
  res.clearCookie(SESSION_NAME)

  return res.status(204).send()
}
