import express from "express";
import {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/TaskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",createTask);
router.get("/", getAllTasks);
router.get("/:id",  getTaskById);
router.put("/:id",  updateTask);
router.delete("/:id", deleteTask);

export default router;
