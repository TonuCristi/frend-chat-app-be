import { Mongoose, connect } from "mongoose";
import config from "./config.js";

export const mongooseClient = new Mongoose();

export default async function connectDB() {
  try {
    await connect(config.mongoUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
}
