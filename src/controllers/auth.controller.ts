import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { parseAsync, ZodError } from "zod";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { UserModel } from "../models/user.model.js";
import { registerSchema } from "../schemas/register.schema.js";
import { User, UserWithoutPassword } from "../types/user.type.js";

export async function register(req: Request, res: Response) {
  const body = req.body;

  try {
    await registerSchema.parseAsync(body);

    const foundUser = await UserModel.findOne({ email: body.email });

    if (foundUser) {
      throw new Error(
        "This email is already in use. Please use a different email or log in to your existing account!",
      );
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(body.password, salt);

    const newUser = await UserModel.create({ ...body, password: hash });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || "", {
      expiresIn: 1000 * 60 * 60 * 24 * 7,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function login(req: Request, res: Response) {
  const body = req.body;

  try {
    const foundUser = await UserModel.findOne({
      email: body.email,
    }).lean<User>();

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

    const token = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_SECRET || "",
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const foundUser = await UserModel.findById(decoded.id);

    if (!foundUser) {
      throw new Error("No account found!");
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong!" });
  }
}

export async function getLoggedUser(req: Request, res: Response) {
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new Error("Not authenticated!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const foundUser = await UserModel.findById(decoded.id)
      .lean<UserWithoutPassword>()
      .select("-password -updatedAt -__v");

    if (!foundUser) {
      throw new Error("No account found!");
    }

    res.status(200).json({
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      createdAt: foundUser.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong!" });
  }
}
