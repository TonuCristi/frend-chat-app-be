import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.route.js";
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

app.use("/api/auth", authRoutes);

app.use(authMiddleware);

app.listen(process.env.PORT, async () => {
  await connectDB();

  console.log(
    `-------------------------------------\nApp running\n-------------------------------------`,
  );
});
