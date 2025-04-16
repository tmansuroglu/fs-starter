import { UnauthorizedError } from "./errors"

export const throwInvalidUsernameOrPasswordError = () => {
  throw new UnauthorizedError({ message: "Invalid user name or password" })
}
