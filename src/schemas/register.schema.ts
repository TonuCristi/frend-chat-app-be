import z from "zod";

import { usernameSchema } from "./username.schema.js";
import { emailSchema } from "./email.schema.js";
import { passwordSchema } from "./password.schema.js";

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
