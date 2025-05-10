import { RouteConfig } from "@asteasolutions/zod-to-openapi"
import { EmailSchema, PasswordSchema } from "@utils/common-schemas"
import { z } from "zod"

const CreateUserRequestPayloadSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export const CreateUserRequestSchema = z.object({
  body: CreateUserRequestPayloadSchema,
})

const CreateUserResponseSchema = z.object({
  message: z.string(),
})

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>

const TAG = "USERS"

export const createUserRegistry: RouteConfig = {
  method: "post",
  path: "/api/v1/users",
  tags: [TAG],
  summary: "Creates User",
  request: {
    body: {
      description: "The user to create",
      content: {
        "application/json": {
          schema: CreateUserRequestPayloadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Object with message.",
      content: {
        "application/json": {
          schema: CreateUserResponseSchema,
        },
      },
    },
  },
}
