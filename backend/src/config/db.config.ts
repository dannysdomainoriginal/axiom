import "dotenv/config";
import mongoose from "mongoose";
import { logger } from "@/libraries/logger";

const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI
      : process.env.ATLAS_URI;

  await mongoose
    .connect(uri)
    .then((conn) => logger.info(`MongoDB connected: ${conn.connection.host}`))
    .catch((error) => {
      logger.error("Mongo connection error: Initiating clean exit");
      console.log(error);
      process.exit(1);
    });
};

export default connectDB;
