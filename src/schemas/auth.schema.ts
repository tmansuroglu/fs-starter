import { z } from "zod"

export const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
})

export type LoginPayload = z.infer<typeof loginSchema>["body"]
