import { Router } from "express"
import { usersRouter } from "./users/router"
import { sessionsRouter } from "./sessions/router"

const apiV1Router = Router()

apiV1Router.use("/users", usersRouter)
apiV1Router.use("/sessions", sessionsRouter)

apiV1Router.use((req, res) => {
  res.status(404).json({ message: "API v1 endpoint not found" })
})

export { apiV1Router }
