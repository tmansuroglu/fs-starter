import { z } from "zod"

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100),
  }),
})

export type LoginPayload = z.infer<typeof loginSchema>["body"]

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(100),
  }),
})

export type RegisterPayload = z.infer<typeof registerSchema>["body"]
