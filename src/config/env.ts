import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

export enum NodeEnvEnum {
  Development = "development",
  Production = "production",
}

const EnvSchema = z
  .object({
    NODE_ENV: z
      .nativeEnum(NodeEnvEnum, {
        required_error: "NODE_ENV is required",
        invalid_type_error: "NODE_ENV must be one of development|production",
      })
      .default(NodeEnvEnum.Development),

    DATABASE_URL: z
      .string({
        required_error: "DATABASE_URL is required",
        invalid_type_error: "DATABASE_URL must be a valid URL",
      })
      .url({ message: "DATABASE_URL must be a well-formed URL" }),
    REDIS_HOST: z.string({
      required_error: "REDIS_HOST is required",
      invalid_type_error: "REDIS_HOST must be a valid URL",
    }),
    REDIS_PORT: z.coerce
      .number({
        invalid_type_error: "REDIS_PORT must be a number",
        required_error: "REDIS_PORT is required",
      })
      .int("REDIS_PORT must be an integer")
      .min(1, { message: "REDIS_PORT must be ≥ 1" })
      .max(65535, { message: "REDIS_PORT must be ≤ 65535" }),
    DB_PORT: z.coerce
      .number({
        invalid_type_error: "DB_PORT must be a number",
        required_error: "DB_PORT is required",
      })
      .int("DB_PORT must be an integer")
      .min(1, { message: "DB_PORT must be ≥ 1" })
      .max(65535, { message: "DB_PORT must be ≤ 65535" }),

    PORT: z.coerce
      .number({
        invalid_type_error: "PORT must be a number",
        required_error: "PORT is required",
      })
      .int("PORT must be an integer")
      .min(1, { message: "PORT must be ≥ 1" })
      .max(65535, { message: "PORT must be ≤ 65535" }),

    JWT_SECRET: z
      .string({
        required_error: "JWT_SECRET is required",
        invalid_type_error: "JWT_SECRET must be a string",
      })
      .min(32, { message: "JWT_SECRET must be at least 32 characters" })
      .max(512, { message: "JWT_SECRET seems too long" }),
    REDIS_PASSWORD: z
      .string({
        required_error: "REDIS_PASSWORD is required",
        invalid_type_error: "REDIS_PASSWORD must be a string",
      })
      .min(32, { message: "REDIS_PASSWORD must be at least 32 characters" })
      .max(512, { message: "REDIS_PASSWORD seems too long" }),

    POSTGRES_USER: z.string({ required_error: "POSTGRES_USER is required" }),

    POSTGRES_PASSWORD: z.string({
      required_error: "POSTGRES_PASSWORD is required",
    }),
    POSTGRES_DB: z.string({ required_error: "POSTGRES_DB is required" }),
    SESSION_SECRET: z
      .string({
        required_error: "SESSION_SECRET is required",
        invalid_type_error: "SESSION_SECRET must be a string",
      })
      .min(32, { message: "SESSION_SECRET must be at least 32 characters" })
      .max(512, { message: "SESSION_SECRET seems too long" }),
  })
  .passthrough()

const parsedEnv = EnvSchema.parse(process.env)

export type EnvConfig = {
  nodeEnv: NodeEnvEnum
  databaseUrl: string
  dbPort: number
  port: number
  jwtSecret: string
  postgresUser: string
  postgresPassword: string
  postgresDb: string
  sessionSecret: string
  redisHost: string
  redisPort: number
  redisPassword: string
}

export const env: EnvConfig = {
  nodeEnv: parsedEnv.NODE_ENV,
  databaseUrl: parsedEnv.DATABASE_URL,
  dbPort: parsedEnv.DB_PORT,
  port: parsedEnv.PORT,
  jwtSecret: parsedEnv.JWT_SECRET,
  postgresUser: parsedEnv.POSTGRES_USER,
  postgresPassword: parsedEnv.POSTGRES_PASSWORD,
  postgresDb: parsedEnv.POSTGRES_DB,
  sessionSecret: parsedEnv.SESSION_SECRET,
  redisHost: parsedEnv.REDIS_HOST,
  redisPort: parsedEnv.REDIS_PORT,
  redisPassword: parsedEnv.REDIS_PASSWORD,
}
