import { z } from "zod"

export const loginSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
})

export type LoginPayload = z.infer<typeof loginSchema>["body"]

export const registerSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
})

export type RegisterPayload = z.infer<typeof registerSchema>["body"]
