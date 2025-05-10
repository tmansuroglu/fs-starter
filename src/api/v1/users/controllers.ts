import { ValidatedRequest } from "@middlewares/validation"
import { Response } from "express"
import { CreateUserRequestSchema, CreateUserResponse } from "./schemas"
import { createUserService } from "@domains/users/services"

type CreateUserRequest = ValidatedRequest<typeof CreateUserRequestSchema>

export const createUserController = async (
  req: CreateUserRequest,
  res: Response
) => {
  const { email, password } = req.body

  await createUserService({ email, password })

  const payload: CreateUserResponse = {
    message: "Successfully created a user.",
  }

  return res.status(201).json(payload)
}
