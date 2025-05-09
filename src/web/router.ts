import { env } from "@config/env"
import {
  renderAdminPage,
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
} from "./controllers"
import express, { NextFunction, Request, Response } from "express"
import { webAuthMiddleware } from "@middlewares/web-auth"

const webRouter = express.Router()

webRouter.get("/", renderHomePage)

webRouter.get("/register", renderRegisterPage)

webRouter.get("/login", renderLoginPage)

webRouter.get("/admin", webAuthMiddleware, renderAdminPage)

webRouter.use((req: Request, res: Response) => {
  res.status(404).render("404")
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
webRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).render("500", {
    message: env.nodeEnv === "development" ? err.message : undefined,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  })
})

export { webRouter }
