import { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { EmailSchema, PasswordSchema, UserSchema } from "@utils/common-schemas"
import { z } from "zod"

const CreateSessionRequestPayloadSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export const CreateSessionRequestSchema = z.object({
  body: CreateSessionRequestPayloadSchema,
})

const CreateSessionResponseSchema = z.object({
  message: z.string(),
  user: UserSchema,
})

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>

const TAG = "SESSIONS"

export const createSessionRegistry: RouteConfig = {
  method: "post",
  path: "/api/v1/sessions",
  tags: [TAG],
  summary: "Creates Session",
  request: {
    body: {
      description: "The user info",
      content: {
        "application/json": {
          schema: CreateSessionRequestPayloadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Object with message and user info.",
      content: {
        "application/json": {
          schema: CreateSessionResponseSchema,
        },
      },
    },
  },
}

export const deleteSessionRegistry: RouteConfig = {
  method: "delete",
  path: "/api/v1/sessions",
  summary: "Deletes Session",
  tags: [TAG],
  responses: {
    204: {
      description: "No response",
    },
  },
}
