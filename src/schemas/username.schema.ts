import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1, { message: "This username field should't be empty!" })
  .max(30, { message: "The username should't be longer than 30 characters!" });
