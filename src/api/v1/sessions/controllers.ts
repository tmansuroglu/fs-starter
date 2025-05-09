import { ValidatedRequest } from "@middlewares/validation"
import { Request, Response } from "express"
import { createSessionSchema } from "./schemas"
import { createSessionService } from "@domains/sessions/services"
import { destroySession, regenerateSession } from "@utils/session-utils"
import { SESSION_NAME } from "@utils/constants"

type CreateSessionRequest = ValidatedRequest<typeof createSessionSchema>

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

  return res.status(201).json({
    message: "Successfully created a session.",
    user,
  })
}

export const deleteSessionController = async (req: Request, res: Response) => {
  await destroySession(req)
  res.clearCookie(SESSION_NAME)

  return res.status(204).send()
}
