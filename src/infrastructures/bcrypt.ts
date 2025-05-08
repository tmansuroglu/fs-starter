import bcrypt from "bcryptjs"

export const compareHash = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash)

export const hash = (plain: string) => bcrypt.hash(plain, 10)
