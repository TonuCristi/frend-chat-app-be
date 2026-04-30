import { NextFunction, Request, Response } from "express";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}
