import { env } from "@config/env"
import { LoginPayload } from "@schemas/auth.schema"
import { InternalServerError, UnauthorizedError } from "@utils/errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUserByUserName } from "src/repositories/user.repository"

export const loginUser = async ({ username, password }: LoginPayload) => {
  const user = await getUserByUserName(username)

  if (!user) {
    throw new UnauthorizedError({ message: "Invalid user name or password" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError({ message: "Invalid user name or password" })
  }

  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: "1h",
  })

  if (!token) {
    throw new InternalServerError()
  }

  return { token }
}
