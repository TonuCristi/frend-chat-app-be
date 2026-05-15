import jwt from "jsonwebtoken";

import config from "../config/config.js";

export function createToken(id: string) {
  const offset = Math.abs(new Date().getTimezoneOffset() * 60 * 1000);

  return jwt.sign({ id, iat: Date.now() + offset }, config.jwtSecret, {
    // expiresIn: 1000 * 60 * 2,
    expiresIn: 1000 * 60 * 60 * 24 * 7,
  });
}
