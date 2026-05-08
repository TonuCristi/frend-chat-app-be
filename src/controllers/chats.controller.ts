import { Request, Response } from "express";
import { Types } from "mongoose";
import { parseAsync, ZodError } from "zod";

import { ChatModel } from "../models/chat.model.js";
import { chatSchema } from "../schemas/chat.schema.js";
import { ChatType } from "../types/chat.type.js";

export async function createChat(req: Request, res: Response) {
  const body = req.body;

  try {
    await chatSchema.parseAsync(body);

    if (
      body.type === ChatType.Group &&
      !(body.createdBy && Types.ObjectId.isValid(body.createdBy))
    ) {
      throw new Error("Invalid createdBy id!");
    }

    const name = body.type === ChatType.Group && body.name ? body.name : null;

    const createdBy =
      body.type === ChatType.Group && body.createdBy ? body.createdBy : null;

    await ChatModel.create({
      type: body.type,
      name,
      createdBy,
    });

    res.status(201).json({ message: "Chat created successfully!" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Something went wrong!" });
  }
}
