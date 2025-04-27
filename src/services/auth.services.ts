import { env } from "@config/env"
import { LoginPayload, RegisterPayload } from "@schemas/auth.schema"
import { InternalServerError, UnauthorizedError } from "@utils/errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUserByEmail } from "src/repositories/user.repository"

export const loginUser = async ({ email, password }: LoginPayload) => {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new UnauthorizedError({ message: "Invalid email or password" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError({ message: "Invalid email or password" })
  }

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: "1h",
  })

  if (!token) {
    throw new InternalServerError()
  }

  return { token }
}

export const registerUser = async ({ email, password }: RegisterPayload) => {
  // TODO: complete this
  console.log(email, password)
}
