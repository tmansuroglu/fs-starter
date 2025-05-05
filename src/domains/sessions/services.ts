import { env } from "@config/env"
import { UnauthorizedError, InternalServerError } from "@errors/custom-errors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUserByEmail } from "./repositories"

type CreateSessionServiceParams = {
  email: string
  password: string
}

export const createSessionService = async ({
  email,
  password,
}: CreateSessionServiceParams) => {
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
