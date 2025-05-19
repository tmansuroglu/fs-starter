import NodeEnvironment from "jest-environment-node"
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from "@testcontainers/postgresql"
import { execSync } from "child_process"

export default class PostgresEnvironment extends NodeEnvironment {
  private container?: StartedPostgreSqlContainer

  async setup(): Promise<void> {
    await super.setup()

    this.container = await new PostgreSqlContainer("postgres:15-alpine")
      .withDatabase("testdb")
      .withUsername("test")
      .withPassword("test")
      .start()

    this.global.process.env.DATABASE_URL = this.container.getConnectionUri()
    this.global.process.env.POSTGRES_USER = this.container.getUsername()
    this.global.process.env.POSTGRES_PASSWORD = this.container.getPassword()
    this.global.process.env.POSTGRES_DB = this.container.getDatabase()

    execSync(
      `npx prisma migrate deploy --schema=${process.cwd()}/prisma/schema.prisma`,
      {
        stdio: "inherit",
        env: this.global.process.env,
      }
    )
  }

  async teardown(): Promise<void> {
    if (this.container) {
      await this.container.stop()
    }
    await super.teardown()
  }
}
