import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true    
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend API is running.");
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Optional: 404 middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null
  });
});

// Centralized error handler
app.use(errorHandler);

export { app };
