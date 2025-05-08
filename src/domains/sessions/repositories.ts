import { db } from "@infrastructures/db"

export const getUserByEmail = async (email: string) =>
  await db.user.findUniqueOrThrow({ where: { email } })
