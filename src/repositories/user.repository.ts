import { db } from "@config/db"
import { User } from "@generated-prisma"

export const getUserByUserName = async (
  username: string
): Promise<User | null> => {
  return await db.user.findUnique({ where: { username } })
}
