import { hash } from "@infrastructures/bcrypt"
import { createUser } from "./repositories"

type CreateUserServiceParams = {
  email: string
  password: string
}

export const createUserService = async ({
  email,
  password,
}: CreateUserServiceParams) => {
  const hashedPassword = await hash(password)

  return await createUser(email, hashedPassword)
}
