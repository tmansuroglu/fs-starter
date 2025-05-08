import { db } from "@infrastructures/db"

export const createUser = async (email: string, password: string) =>
  await db.user.create({ data: { email, password } })
