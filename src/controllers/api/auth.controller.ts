import { Request, Response } from "express"
import { loginUser } from "../../services/auth.services"

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body // TODO: needs to be typed

  const { token } = await loginUser({ username, password })

  return res.status(200).json({
    message: "Login successful",
    token,
  })
}
