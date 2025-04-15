import db from "../config/db"

export const getUserByEmail = async (username: string) => {
  return await db.user.findUnique({ where: { username } })
}
