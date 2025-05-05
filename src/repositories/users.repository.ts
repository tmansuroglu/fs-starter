import { db } from "@config/db"
import { User } from "@generated-prisma"

export const getUserByEmail = async (email: string): Promise<User | null> =>
  await db.user.findUniqueOrThrow({ where: { email } })

export const createUser = async (
  email: string,
  password: string
): Promise<User | null> => await db.user.create({ data: { email, password } })
