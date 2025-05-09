import { z } from "zod"
import { escapeHtml } from "./escape-html"

export const authValidationSchema = z.object({
  body: z.object({
    email: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
      z
        .string({
          required_error: "Email is required",
          invalid_type_error: "Email must be a string",
        })
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" })
    ),
    password: z.preprocess(
      (val) => {
        if (typeof val !== "string") {
          return val
        }

        const trimmed = val.trim()

        return escapeHtml(trimmed)
      },
      z
        .string({
          required_error: "Password is required",
          invalid_type_error: "Password must be a string",
        })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password must be at most 20 characters" })
    ),
  }),
})
