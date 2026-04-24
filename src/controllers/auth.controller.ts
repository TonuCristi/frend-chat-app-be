import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { parseAsync, ZodError } from "zod";

import { User } from "../models/user.model.js";
import { registerSchema } from "../schemas/register.schema.js";

export async function register(req: Request, res: Response) {
  const body = req.body;

  try {
    await registerSchema.parseAsync(body);

    const foundUser = await User.findOne({ email: body.email });

    if (foundUser) {
      throw new Error(
        "This email is already in use. Please use a different email or log in to your existing account!",
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(body.password, salt);

    await User.create({ ...body, password: hash });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(500).json({ message: error.issues[0].message });
    }

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export async function login(req: Request, res: Response) {
  const body = req.body;

  try {
    const foundUser = await User.findOne({ email: body.email }).lean();

    console.log(foundUser);

    if (!foundUser) {
      throw new Error(
        "No account found with this email. Please sign up or check your credentials!",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new Error(
        "Incorrect password. Please try again or reset your password!",
      );
    }

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}
