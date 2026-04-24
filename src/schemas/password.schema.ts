import { z } from "zod";

export const passwordSchema = z
  .string()
  .trim()
  .min(8, {
    message: "The password should be at least 8 characters!",
  })
  .regex(new RegExp(".*[A-Z].*"), {
    message: "The password should contain at least 1 uppercase letter!",
  })
  .regex(new RegExp(".*[a-z].*"), {
    message: "The password should contain at least 1 lowercase letter!",
  })
  .regex(new RegExp(".*[0-9].*"), {
    message: "The password should contain at least 1 number!",
  })
  .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"), {
    message: "The password should contain at least 1 special character!",
  });
