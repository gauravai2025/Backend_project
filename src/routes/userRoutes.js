import express from "express";

import{
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
 
  getUserById,
  getAllUsers,
  logoutUser, 
} from "../controllers/UserController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔓 Public Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", authenticate, logoutUser);

// 🔐 Authenticated Route
router.get("/me", authenticate, getCurrentUser);

// 🔐 Assignment-required User APIs
// You can choose whether to protect these — example shown below:

router.get("/users", authenticate, getAllUsers);
router.get("/users/:id", authenticate, getUserById);

export default router;
