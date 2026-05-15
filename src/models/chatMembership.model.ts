import { Schema, model } from "mongoose";

const chatMembershipSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  { timestamps: true },
);

export const ChatMembershipModel = model(
  "ChatMembership",
  chatMembershipSchema,
);
