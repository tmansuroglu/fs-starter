/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema } from "zod"
import type { NextFunction, Request, Response } from "express"
import { BadRequestError } from "@utils/errors"

// 1. Pull out the full parsed output type from any ZodSchema
type SchemaOutput<Schema extends ZodSchema<any>> =
  Schema extends ZodSchema<infer Output> ? Output : never

// 2. Extract each part of the HTTP request by a clear, descriptive name
type RequestParamsFrom<Schema extends ZodSchema<any>> =
  SchemaOutput<Schema> extends { params: infer InferredParams }
    ? InferredParams
    : {}

type RequestBodyFrom<Schema extends ZodSchema<any>> =
  SchemaOutput<Schema> extends { body: infer InferredBody } ? InferredBody : {}

type RequestQueryFrom<Schema extends ZodSchema<any>> =
  SchemaOutput<Schema> extends { query: infer InferredQuery }
    ? InferredQuery
    : {}

// 3. Build a Request type that uses those descriptive pieces
export type ValidatedRequest<Schema extends ZodSchema<any>> = Request<
  RequestParamsFrom<Schema>, // req.params shape
  any, // response body type (ignored)
  RequestBodyFrom<Schema>, // req.body shape
  RequestQueryFrom<Schema> // req.query shape
>

// 4. And the handler signature we return
type ZodValidationHandler<Schema extends ZodSchema<any>> = (
  req: ValidatedRequest<Schema>,
  res: Response,
  next: NextFunction
) => void

export function validate<Schema extends ZodSchema<any>>(
  schema: Schema
): ZodValidationHandler<Schema> {
  return (req, res, next) => {
    const payload = {
      params: req.params,
      query: req.query,
      body: req.body,
    }

    const result = schema.safeParse(payload)

    if (!result.success) {
      const errors = result.error.issues.reduce(
        (acc, issue) => {
          const key = issue.path.join(".") || issue.path.toString()
          acc[key] = issue.message
          return acc
        },
        {} as Record<string, string>
      )

      throw new BadRequestError({
        message: "Failed to validate payload",
        errors,
      })
    }

    // overwrite req.params/query/body with Zod’s cleaned & transformed data
    Object.assign(req, result.data)
    next()
  }
}
