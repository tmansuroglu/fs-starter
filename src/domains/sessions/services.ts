import { UnauthorizedError, InternalServerError } from "@errors/custom-errors"
import { getUserByEmail } from "./repositories"
import { compareHash } from "@infrastructures/bcrypt"
import { signToken } from "@infrastructures/jwt"

type CreateSessionServiceParams = {
  email: string
  password: string
}

export const createSessionService = async ({
  email,
  password,
}: CreateSessionServiceParams) => {
  const user = await getUserByEmail(email)

  const isPasswordValid = await compareHash(password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError({ message: "Invalid password." })
  }

  const token = signToken(
    { userId: user.id },
    {
      expiresIn: "1h",
    }
  )

  if (!token) {
    throw new InternalServerError({ message: "Failed to create token" })
  }

  return { token, user }
}
