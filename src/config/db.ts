import { PrismaClient } from "@generated-prisma"
import { env, NodeEnvEnum } from "./env"

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient
}

const globalForPrisma = globalThis as GlobalPrisma

const db: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (env.nodeEnv === NodeEnvEnum.Development) {
  globalForPrisma.prisma = db
}

export { db }
