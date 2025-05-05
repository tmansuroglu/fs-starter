import bcrypt from "bcryptjs"
import { createUser } from "./repositories"

type CreateUserServiceParams = {
  email: string
  password: string
}

export const createUserService = async ({
  email,
  password,
}: CreateUserServiceParams) => {
  const hashedPassword = bcrypt.hashSync(password, 10)

  return await createUser(email, hashedPassword)
}
