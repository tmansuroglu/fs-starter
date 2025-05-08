import jwt, { SignOptions } from "jsonwebtoken"
import { env } from "@config/env"

export const signToken = (payload: object, options: SignOptions) => {
  return jwt.sign(payload, env.jwtSecret, options)
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret)
}
