import { ONE_DAY_IN_MS } from "@utils/constants"
import { CookieOptions } from "express"
import { env } from "./env"
import { NodeEnvEnum } from "@utils/enums"

export const cookieOptions: CookieOptions = {
  maxAge: ONE_DAY_IN_MS,
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === NodeEnvEnum.Production,
}
