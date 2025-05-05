import { Response } from "express"

export type FieldErrors = Record<string, string>

interface ApiErrorResponse {
  message: string
  code?: string
  errors?: FieldErrors
  timestamp: string
  requestId?: string
}

interface ApiErrorResponderParams {
  res: Response
  statusCode: number
  message: string
  code?: string
  fieldErrors?: FieldErrors
  requestId?: string
}

export function apiErrorResponder({
  res,
  statusCode,
  message,
  code,
  fieldErrors,
  requestId,
}: ApiErrorResponderParams) {
  const payload: ApiErrorResponse = {
    message,
    timestamp: new Date().toISOString(),
    ...(code && { code }),
    ...(fieldErrors && { errors: fieldErrors }),
    ...(requestId && { requestId }),
  }

  return res.status(statusCode).json(payload)
}
