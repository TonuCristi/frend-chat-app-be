import { Request, Response } from "express";
import { parseAsync, ZodError } from "zod";

import { ChatModel } from "../models/chat.model.js";
import { chatSchema } from "../schemas/chat.schema.js";
import { Chat, ChatMembership, ChatType } from "../types/chat.type.js";
import { ChatMembershipModel } from "../models/chatMembership.model.js";
import { UserModel } from "../models/user.model.js";
import { User } from "../types/user.type.js";
import { verifyToken } from "../utils/verifyToken.js";
import { QueryOptions } from "mongoose";

export async function createChat(req: Request, res: Response) {
  const body = req.body;

  try {
    await chatSchema.parseAsync(body);

    const token = req.cookies.token;

    const decoded = verifyToken(token);

    const userId = decoded.id;

    if (body.type === ChatType.Direct) {
      const foundUser = await UserModel.findOne({
        email: body.recipientEmail,
      }).lean<User>();

      if (!foundUser) {
        throw new Error("Recipient account not found!");
      }

      const createdChat = await ChatModel.create({
        type: body.type,
      });

      const foundRecipientChatMember = await ChatMembershipModel.findOne({
        memberId: foundUser._id,
      });

      const foundSenderChatMember = await ChatMembershipModel.findOne({
        memberId: userId,
      });

      if (
        foundRecipientChatMember &&
        foundSenderChatMember &&
        createdChat.type === ChatType.Direct
      ) {
        await ChatModel.findByIdAndDelete(createdChat._id);

        throw new Error("Direct chat already exists!");
      }

      await ChatMembershipModel.create({
        memberId: foundUser._id,
        chatId: createdChat._id,
      });

      await ChatMembershipModel.create({
        memberId: userId,
        chatId: createdChat._id,
      });
    }

    if (body.type === ChatType.Group) {
      const createdChat = await ChatModel.create({
        type: body.type,
        name: body.name,
        createdBy: userId,
      });

      await ChatMembershipModel.create({
        memberId: userId,
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
  const queryParams = req.query;

  try {
    const token = req.cookies.token;

    const decoded = verifyToken(token);

    const userId = decoded.id;

    const foundMemberships = await ChatMembershipModel.find({
      memberId: userId,
    })
      .select("-_id chatId")
      .lean<ChatMembership[]>();

    const chatIds = foundMemberships.map((m) => m.chatId);

    const page = Number(queryParams.page);
    const perPage = Number(queryParams.perPage);
    const type =
      queryParams.type === ChatType.Direct ||
      queryParams.type === ChatType.Group
        ? queryParams.type
        : undefined;

    const foundChats = await ChatModel.find({
      _id: { $in: chatIds },
      ...(type ? { type } : {}),
    })
      .skip(page * perPage)
      .limit(perPage)
      .select("-__v -updatedAt")
      .lean<Chat[]>();

    const chats = [];

    for (let i = 0; i < foundChats.length; i++) {
      const chat = foundChats[i];

      if (chat.type === ChatType.Group) {
        const { _id, ...restChat } = chat;

        chats.push({ id: _id, ...restChat });
      }

      if (chat.type === ChatType.Direct) {
        const foundMembership = await ChatMembershipModel.findOne({
          chatId: chat._id,
          memberId: { $ne: userId },
        })
          .select("-__v -updatedAt")
          .lean<ChatMembership>();

        if (!foundMembership) continue;

        const foundUser = await UserModel.findById(foundMembership.memberId)
          .select("-_id username")
          .lean<User>();

        if (!foundUser) continue;

        const {
          _id: foundMembershipId,
          memberId,
          ...restFoundMembership
        } = foundMembership;

        const foundMember = {
          id: memberId,
          membershipId: foundMembershipId,
          ...restFoundMembership,
          ...foundUser,
        };

        const { _id: chatId, ...restChat } = chat;

        chats.push({ id: chatId, ...restChat, recipient: foundMember });
      }
    }

    res.status(201).json({ chats });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Something went wrong!" });
  }
}
