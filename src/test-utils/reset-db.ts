import { execSync } from "child_process"

export const resetDb = () =>
  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
    env: process.env,
  })
