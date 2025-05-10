/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodTypeAny } from "zod"
import type { NextFunction, Request, Response } from "express"
import { FieldErrors } from "@utils/api-error-responder"
import { BadRequestError } from "@errors/custom-errors"

// 1. Pull out the full parsed output type from any ZodSchema
type SchemaOutput<Schema extends ZodTypeAny> = import("zod").infer<Schema>

// 2. Extract each part of the HTTP request by a clear, descriptive name
type RequestParamsFrom<Schema extends ZodTypeAny> =
  SchemaOutput<Schema> extends { params: infer P } ? P : {}
type RequestBodyFrom<Schema extends ZodTypeAny> =
  SchemaOutput<Schema> extends { body: infer B } ? B : {}
type RequestQueryFrom<Schema extends ZodTypeAny> =
  SchemaOutput<Schema> extends { query: infer Q } ? Q : {}

// 3. Build a Request type that uses those descriptive pieces
export type ValidatedRequest<Schema extends ZodTypeAny> = Request<
  RequestParamsFrom<Schema>, // req.params shape
  any, // response body type (ignored)
  RequestBodyFrom<Schema>, // req.body shape
  RequestQueryFrom<Schema> // req.query shape
>

// 4. And the handler signature we return
type ZodValidationHandler<Schema extends ZodTypeAny> = (
  req: ValidatedRequest<Schema>,
  res: Response,
  next: NextFunction
) => void

export function validate<Schema extends ZodTypeAny>(
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
      const errors = result.error.issues.reduce((acc, issue) => {
        const key = issue.path[issue.path.length - 1]
        acc[key] = issue.message
        return acc
      }, {} as FieldErrors)

      const err = new BadRequestError({
        message: "Failed to validate payload",
        errors,
      })

      return next(err)
    }

    // overwrite req.params/query/body with Zod’s cleaned & transformed data
    Object.assign(req, result.data)
    next()
  }
}
