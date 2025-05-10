import swaggerUi from "swagger-ui-express"
import type { Express } from "express"
import { createUserRegistry } from "../users/schemas"
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import {
  createSessionRegistry,
  deleteSessionRegistry,
} from "../sessions/schemas"
import { env } from "@config/env"
import { NodeEnvEnum } from "@utils/enums"

extendZodWithOpenApi(z)

export const openApiRegistry = new OpenAPIRegistry()

openApiRegistry.registerPath(createUserRegistry)

openApiRegistry.registerPath(createSessionRegistry)

openApiRegistry.registerPath(deleteSessionRegistry)

const generator = new OpenApiGeneratorV3(openApiRegistry.definitions)

const openApiDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
})

export function setupSwagger(app: Express) {
  if (env.nodeEnv === NodeEnvEnum.Production) {
    return
  }

  app.get("/docs/openapi.json", (_req, res) => {
    res.json(openApiDoc)
  })

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiDoc, {
      explorer: true,
      swaggerOptions: { docExpansion: "none" },
    })
  )
}
