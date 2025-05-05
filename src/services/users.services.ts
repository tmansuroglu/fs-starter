import { createUser } from "@repositories/users.repository"
import { CreateUserPayload } from "@schemas/users.schema"
import bcrypt from "bcryptjs"

export const createUserService = async ({
  email,
  password,
}: CreateUserPayload) => {
  const hashedPassword = bcrypt.hashSync(password, 10)

  return await createUser(email, hashedPassword)
}
