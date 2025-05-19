import { db } from "@infrastructures/db"

export const startDb = () => db.$connect()
