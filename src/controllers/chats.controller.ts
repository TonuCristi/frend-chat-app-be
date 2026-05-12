import { Request, Response } from "express";
import { Types } from "mongoose";
import { parseAsync, ZodError } from "zod";
import jwt from "jsonwebtoken";

import { ChatModel } from "../models/chat.model.js";
import { chatSchema } from "../schemas/chat.schema.js";
import { Chat, ChatType } from "../types/chat.type.js";
import { ChatMemberModel } from "../models/chatMember.model.js";
import { UserModel } from "../models/user.model.js";
import { User } from "../types/user.type.js";

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

    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    if (body.type === ChatType.Direct) {
      const foundUser = await UserModel.findOne({
        email: body.recipientEmail,
      }).lean<User>();

      if (!foundUser) {
        throw new Error("Recipient account not found!");
      }

      const createdChat = await ChatModel.create({
        type: body.type,
        name,
        createdBy,
      });

      const foundRecipientChatMember = await ChatMemberModel.findOne({
        memberId: foundUser._id,
      });

      const foundSenderChatMember = await ChatMemberModel.findOne({
        memberId: decoded.id,
      });

      if (
        foundRecipientChatMember &&
        foundSenderChatMember &&
        createdChat.type === ChatType.Direct
      ) {
        await ChatModel.findByIdAndDelete(createdChat._id);

        throw new Error("Direct chat already exists!");
      }

      await ChatMemberModel.create({
        memberId: foundUser._id,
        chatId: createdChat._id,
      });

      await ChatMemberModel.create({
        memberId: decoded.id,
        chatId: createdChat._id,
      });
    }

    if (body.type === ChatType.Group) {
      const createdChat = await ChatModel.create({
        type: body.type,
        name,
        createdBy,
      });

      await ChatMemberModel.create({
        memberId: decoded.id,
        chatId: createdChat._id,
      });
    }

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

export async function getChats(req: Request, res: Response) {
  const body = req.body;

  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const foundPersonalChats = await ChatMemberModel.find({
      memberId: decoded.id,
    })
      .select("-_id chatId")
      .lean();

    const chatIds = foundPersonalChats.map((chat) => chat.chatId);

    const foundChats: Chat[] = [];

    for (let i = 0; i < chatIds.length; i++) {
      const foundChat = await ChatModel.findById(chatIds[i]).lean<Chat>();

      if (foundChat) {
        foundChats.push(foundChat);
      }
    }

    console.log(foundChats);

    res.status(201).json({ chats: [] });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Something went wrong!" });
  }
}
