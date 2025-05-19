import { db } from "@infrastructures/db"

export const getUserByEmail = (email: string) =>
  db.user.findUniqueOrThrow({
    where: { email },
    select: { id: true, password: true },
  })
