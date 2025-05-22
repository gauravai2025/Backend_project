
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

    const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);

    console.log(`✅ MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    // Optional: Replace with logger.error(...) if using Winston
    console.error("❌ MongoDB connection failed:", error.message);
    throw new ApiError(500, "Database connection failed");
  }
};

export default connectDB;
