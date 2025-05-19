import { db } from "@infrastructures/db"
import { getUserByEmail } from "./repositories"
import { resetDb } from "@test-utils/reset-db"
import { startDb } from "@test-utils/start-db"

const TEST_USER = {
  email: "doesnotexist@example.com",
  password: "password",
  id: 1,
}

describe("Session repository tests", () => {
  beforeEach(async () => {
    await startDb()
  })

  afterEach(() => {
    resetDb()
  })

  describe("getUserByEmail function", () => {
    it("gets the user properly", async () => {
      await db.user.create({
        data: { email: TEST_USER.email, password: TEST_USER.password },
      })

      expect(await getUserByEmail(TEST_USER.email)).toEqual({
        id: TEST_USER.id,
        password: TEST_USER.password,
      })
    })

    it("throws error", async () => {
      await expect(getUserByEmail("doesnotexist@example.com")).rejects.toThrow()
    })

    it("rejects on SQL-injection-like input", async () => {
      await expect(getUserByEmail(`' OR 1=1; --`)).rejects.toThrow()
    })
  })
})
