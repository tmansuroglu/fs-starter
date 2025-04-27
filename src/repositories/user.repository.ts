import { db } from "@config/db"
import { User } from "@generated-prisma"

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await db.user.findUnique({ where: { email } })
}
