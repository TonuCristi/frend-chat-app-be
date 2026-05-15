import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/verifyToken.js";
import { UserModel } from "../models/user.model.js";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new Error("Not authenticated!");
    }

    const decoded = verifyToken(token);
    const offset = Math.abs(new Date().getTimezoneOffset() * 60 * 1000);

    if (decoded.exp < Date.now() + offset) {
      throw new Error("Not authenticated!");
    }

    const userId = decoded.id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      throw new Error("User not found!");
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Something went wrong!" });
  }
}
