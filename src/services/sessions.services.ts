import { env } from "@config/env"
import { getUserByEmail } from "@repositories/users.repository"
import { CreateSessionPayload } from "@schemas/sessions.schema"
import { InternalServerError, UnauthorizedError } from "@utils/errors-classes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const createSessionService = async ({
  email,
  password,
}: CreateSessionPayload) => {
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
