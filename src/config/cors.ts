import cors, { CorsOptions } from "cors"
import { env } from "./env"
import { CorsError } from "@utils/errors-classes"

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.corsOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(
      new CorsError({ message: `Origin ${origin} not allowed` }),
      false
    )
  },
  credentials: true, // allows cookies for sessions
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  optionsSuccessStatus: 204,
}

export const corsMiddleware = cors(corsOptions)
