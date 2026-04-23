import { Mongoose, connect } from "mongoose";
import "dotenv/config";

export const mongooseClient = new Mongoose();

export default async function connectDB() {
  try {
    await connect(process.env.MONGODB_URL || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
  // mongooseClient
  //   .connect(process.env.MONGODB_URL || "")
  //   .then(() => {
  //     console.log(
  //       `----------------------------------------------\nRunning on port: ${process.env.PORT}\n----------------------------------------------`,
  //     );
  //   })
  //   .catch((error) => {
  //     console.log("Error at DB connection: ", error);
  //   });
}
