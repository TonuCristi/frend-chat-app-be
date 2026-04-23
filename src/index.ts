import express from "express";
import authRoutes from "./routes/auth.route.js";
import "dotenv/config";
import connectDB from "./config/connectDB.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, async () => {
  await connectDB();

  console.log(
    `-------------------------------------\nApp running on port ${process.env.PORT}\n-------------------------------------`,
  );
});
