import { UnauthorizedError } from "@errors/custom-errors"
import { getUserByEmail } from "./repositories"
import { compareHash } from "@infrastructures/bcrypt"

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

  return { user }
}
