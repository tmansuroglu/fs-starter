import { Response } from "express"

export type FieldErrors = Record<string, string>

interface ErrorResponse {
  message: string
  code?: string
  errors?: FieldErrors
  timestamp: string
  requestId?: string
}

interface ErrorResponderParams {
  res: Response
  statusCode: number
  message: string
  code?: string
  fieldErrors?: FieldErrors
  requestId?: string
}

export function errorResponder({
  res,
  statusCode,
  message,
  code,
  fieldErrors,
  requestId,
}: ErrorResponderParams) {
  const payload: ErrorResponse = {
    message,
    timestamp: new Date().toISOString(),
    ...(code && { code }),
    ...(fieldErrors && { errors: fieldErrors }),
    ...(requestId && { requestId }),
  }

  return res.status(statusCode).json(payload)
}
