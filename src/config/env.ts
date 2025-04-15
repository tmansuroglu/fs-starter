import dotenv from "dotenv"

dotenv.config()

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  NODE_ENV: getEnv("NODE_ENV"),
  PORT: parseInt(getEnv("PORT"), 10),
  JWT_SECRET: getEnv("JWT_SECRET"),
  DATABASE_URL: getEnv("DATABASE_URL"),
}
