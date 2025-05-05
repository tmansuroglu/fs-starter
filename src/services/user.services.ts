import { createUser } from "@repositories/user.repository"
import { CreateUserPayload } from "@schemas/user.schema"
import bcrypt from "bcryptjs"

export const createUserService = async ({
  email,
  password,
}: CreateUserPayload) => {
  const hashedPassword = bcrypt.hashSync(password, 10)

  return await createUser(email, hashedPassword)
}
