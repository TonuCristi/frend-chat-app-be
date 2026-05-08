import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRoute from "./routes/auth.route.js";
import chatsRoute from "./routes/chats.route.js";
import connectDB from "./config/connectDB.js";
import authMiddleware from "./middlewares/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.API_BASE_URL_PROD
        : process.env.API_BASE_URL_DEV,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use(authMiddleware);

app.use("/api/chats", chatsRoute);

app.listen(
  process.env.PORT ? Number(process.env.PORT) : 8000,
  "0.0.0.0",
  async () => {
    await connectDB();

    console.log("App running");
  },
);
