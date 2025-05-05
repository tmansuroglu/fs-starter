import { User } from "@generated-prisma"
import { db } from "@infrastructures/db"

export const getUserByEmail = async (email: string): Promise<User | null> =>
  await db.user.findUniqueOrThrow({ where: { email } })
