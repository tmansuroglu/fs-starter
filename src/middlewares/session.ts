import session, { SessionOptions } from "express-session"
import { RedisStore } from "connect-redis"
import { NodeEnvEnum } from "@utils/enums"
import { env } from "@config/env"
import { redisClient } from "@infrastructures/redis-client"

const sessionOptions: SessionOptions = {
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === NodeEnvEnum.Production,
  },
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:",
    ttl: 60 * 60 * 24,
  }),
}

export const sessionMiddleware = session(sessionOptions)
