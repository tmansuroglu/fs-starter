import { ValidatedRequest } from "@middlewares/validation.middleware"
import { loginSchema, registerSchema } from "@schemas/auth.schema"
import { loginUser, registerUser } from "@services/auth.services"
import { Response } from "express"

type LoginRequest = ValidatedRequest<typeof loginSchema>

export const loginController = async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body

  const { token } = await loginUser({ email, password })

  return res.status(200).json({
    message: "Login successful",
    token,
  })
}

type RegisterRequest = ValidatedRequest<typeof registerSchema>

export const registerController = async (
  req: RegisterRequest,
  res: Response
) => {
  const { email, password } = req.body

  await registerUser({ email, password })

  return res.status(200).json({
    message: "Register successful",
  })
}
