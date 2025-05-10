/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodObject, ZodType, ZodTypeAny, UnknownKeysParam } from "zod"

export type SchemaFromType<
  T extends Record<string, any>,
  U extends UnknownKeysParam = "strip",
> = ZodObject<
  { [K in keyof T]: ZodType<T[K], any, any> }, // shape
  U, // how to handle extra keys
  ZodTypeAny, // catch-all schema
  T // output type
>
