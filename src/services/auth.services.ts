import { env } from "@config/env"
import { createUser, getUserByEmail } from "@repositories/user.repository"
import { LoginPayload, RegisterPayload } from "@schemas/auth.schema"
import { InternalServerError, UnauthorizedError } from "@utils/errors-classes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const loginUser = async ({ email, password }: LoginPayload) => {
  const user = await getUserByEmail(email)

  const isPasswordValid = await bcrypt.compare(password, user?.password || "")

  if (!isPasswordValid) {
    throw new UnauthorizedError({ message: "Invalid password." })
  }

  const token = jwt.sign({ userId: user?.id }, env.jwtSecret, {
    expiresIn: "1h",
  })

  if (!token) {
    throw new InternalServerError({ message: "Failed to create token" })
  }

  return { token }
}

export const registerUser = async ({ email, password }: RegisterPayload) => {
  const hashedPassword = bcrypt.hashSync(password, 10)

  return await createUser(email, hashedPassword)
}
