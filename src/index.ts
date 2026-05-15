import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import chatsRoute from "./routes/chats.route.js";
import connectDB from "./config/connectDB.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import config from "./config/config.js";

const app = express();

app.use(
  cors({
    origin:
      config.nodeEnv === "production"
        ? config.apiBaseUrlProd
        : config.apiBaseUrlDev,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use(authMiddleware);

app.use("/api/chats", chatsRoute);

app.listen(config.port, "0.0.0.0", async () => {
  await connectDB();

  console.log("App running");
});
