import { ValidatedRequest } from "@middlewares/validation.middleware"
import { loginSchema } from "@schemas/auth.schema"
import { loginUser } from "@services/auth.services"
import { Response } from "express"

type LoginRequest = ValidatedRequest<typeof loginSchema>

export const loginController = async (req: LoginRequest, res: Response) => {
  const { username, password } = req.body

  const { token } = await loginUser({ username, password })

  return res.status(200).json({
    message: "Login successful",
    token,
  })
}
