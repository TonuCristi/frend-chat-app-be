import { Request, Response } from "express";

import { User } from "../models/user.model.js";

export async function register(req: Request, res: Response) {
  const body = req.body;

  try {
    console.log(body);

    await User.create({
      fullName: "john",
      email: "john@mail.com",
      password: "john2002",
    });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function login(req: Request, res: Response) {
  const body = req.body;

  try {
    console.log(body);

    res.status(201).json({ message: "Logged in successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}
