import { PrismaClient } from "@prisma/client"
import { mockDeep, mockReset } from "jest-mock-extended"

jest.mock("@infrastructures/db", () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}))

import { DeepMockProxy } from "jest-mock-extended"
import { db } from "@infrastructures/db"

export const prismaMock = db as DeepMockProxy<typeof db>

beforeEach(() => {
  mockReset(prismaMock)
})
