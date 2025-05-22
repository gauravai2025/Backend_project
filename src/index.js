import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config({ path: "./.env" });

import connectDB from "./configdb/db.js";
import { app } from "./app.js";



const PORT = process.env.PORT || 8000;

// Async function to start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening on specified port
    app.listen(PORT, () => {
      console.log(`✅ Server is running at: http://localhost:${PORT}`);
    });

    // Handle Express app-level errors
    app.on("error", (error) => {
      console.error("❌ Express app error:", error);
      process.exit(1);
    });

  } catch (error) {
    // Handle DB connection failure
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
