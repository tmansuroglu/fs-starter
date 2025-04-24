import { PrismaClient } from "@generated-prisma"
import { env, NodeEnvEnum } from "./env"

// ✅ Define a custom type for the global object
type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient
}

// ✅ Use that custom type in the cast
const globalForPrisma = globalThis as GlobalPrisma

// ✅ Explicitly type `db` so TypeScript knows what it is
const db: PrismaClient = globalForPrisma.prisma ?? new PrismaClient()

if (env.nodeEnv !== NodeEnvEnum.Production) {
  globalForPrisma.prisma = db
}

export default db
