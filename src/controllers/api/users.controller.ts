import { ValidatedRequest } from "@middlewares/validation.middleware"
import { createUserSchema } from "@schemas/users.schema"
import { createUserService } from "@services/users.services"
import { Response } from "express"

type CreateUserRequest = ValidatedRequest<typeof createUserSchema>

export const createUserController = async (
  req: CreateUserRequest,
  res: Response
) => {
  const { email, password } = req.body

  await createUserService({ email, password })

  return res.status(201).json({
    message: "Successfully created user.",
  })
}
