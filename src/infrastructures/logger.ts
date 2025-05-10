import pino from "pino"
import { env } from "@config/env"
import pinoHttp from "pino-http"
import { NodeEnvEnum } from "@utils/enums"

export const pinoLogger = pinoHttp({
  logger: pino({
    level: env.nodeEnv === NodeEnvEnum.Production ? "info" : "debug",
  }),
  genReqId: (req) => req.id,
  serializers: {
    req: ({ id, method, url }) => ({ id, method, url }),
    res: ({ statusCode }) => ({ statusCode }),
  },
})
