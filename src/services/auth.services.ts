import { env } from "@config/env"
import { InternalServerError, UnauthorizedError } from "@utils/errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUserByUserName } from "src/repositories/user.repository"

type LoginUserParameters = {
  username: string
  password: string
}
export const loginUser = async ({
  username,
  password,
}: LoginUserParameters) => {
  // TODO: add validation
  const user = await getUserByUserName(username)

  if (!user) {
    throw new UnauthorizedError({ message: "Invalid user name or password" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError({ message: "Invalid user name or password" })
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "1h",
  })

  if (!token) {
    throw new InternalServerError()
  }

  return { token }
}
