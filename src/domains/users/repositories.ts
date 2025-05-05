import { User } from "@generated-prisma"
import { db } from "@infrastructures/db"

export const createUser = async (
  email: string,
  password: string
): Promise<User | null> => await db.user.create({ data: { email, password } })
