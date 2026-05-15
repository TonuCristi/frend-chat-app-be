import jwt from "jsonwebtoken";

import config from "../config/config.js";

export function verifyToken(token?: string) {
  try {
    if (!token) throw new Error("Invalid token!");

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      iat: number;
      exp: number;
    };

    return decoded;
  } catch (error) {
    throw error;
  }
}
