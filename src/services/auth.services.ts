import { env } from "../config/env"
import { getUserByUserName } from "../repositories/user.repository"
import { InternalServerError } from "../utils/errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { throwInvalidUsernameOrPasswordError } from "../utils/service"

type LoginUserParameters = {
  username: string
  password: string
}
export const loginUser = async ({
  username,
  password,
}: LoginUserParameters) => {
  // - add csrf protection
  // - add rate limiting for safety
  // - add validation
  // - Set Security Headers
  const user = await getUserByUserName(username)

  if (!user) {
    return throwInvalidUsernameOrPasswordError()
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return throwInvalidUsernameOrPasswordError()
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "1h",
  })

  if (!token) {
    throw new InternalServerError()
  }

  return { token }
}
