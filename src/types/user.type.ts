import z from "zod";

import { registerSchema } from "../schemas/register.schema.js";

export type User = z.infer<typeof registerSchema>;
