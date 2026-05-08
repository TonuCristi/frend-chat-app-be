import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const ChatModel = model("Chat", chatSchema);
