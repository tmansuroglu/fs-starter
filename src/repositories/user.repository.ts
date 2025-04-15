import db from "../config/db"

export const getUserByUserName = async (username: string) => {
  return await db.user.findUnique({ where: { username } })
}
