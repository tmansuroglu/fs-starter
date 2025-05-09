import { Request } from "express"

export const regenerateSession = async (req: Request): Promise<void> => {
  return new Promise((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve()))
  )
}

export const destroySession = (req: Request): Promise<void> => {
  return new Promise((resolve, reject) =>
    req.session.destroy((err) => (err ? reject(err) : resolve()))
  )
}
