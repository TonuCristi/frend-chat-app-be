import z from "zod";

import { ChatType } from "../types/chat.type.js";

export const chatSchema = z
  .object({
    type: z.enum(ChatType, { message: "Chat type invalid!" }),
    name: z.string().nullable(),
    createdBy: z.string().nullable(),
  })
  .refine((data) => !(data.type === ChatType.Group && !data.name), {
    error: "The name is required for group chats!",
  })
  .refine((data) => !(data.type === ChatType.Group && !data.createdBy), {
    error: "createdBy is required for group chats!",
  });
