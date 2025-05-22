import { Task } from "../models/Task.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Create a task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, assignedUserId } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      status,
      assignedUserId,
    });

    await task.save();

    return res.status(201).json(
      new ApiResponse(201, { task }, "Task created")
    );
  } catch (err) {
    next(new ApiError(400, err.message));
  }
};

// ✅ Get task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedUserId", "username email fullName");
    if (!task) throw new ApiError(404, "Task not found");

    return res.json(new ApiResponse(200, { task }));
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const allowedStatus = ["pending", "in-progress", "completed"];

    // Parse and validate query params
    let pageNum = parseInt(req.query.page) || 1;
    let limitNum = parseInt(req.query.limit) || 10;

    if (pageNum < 1) pageNum = 1;
    if (limitNum < 1) limitNum = 10;

    // Cap limit to 50 max (to avoid huge payloads)
    limitNum = Math.min(limitNum, 50);

    const { status, assignedUserId } = req.query;

    if (status && !allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid status filter");
    }

    if (assignedUserId && !mongoose.Types.ObjectId.isValid(assignedUserId)) {
      throw new ApiError(400, "Invalid assignedUserId filter");
    }

    const filter = {};
    if (status) filter.status = status;
    if (assignedUserId) filter.assignedUserId = assignedUserId;

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limitNum);

    // If page requested is more than total pages, return empty result
    if (pageNum > totalPages && totalPages !== 0) pageNum = totalPages;

    const tasks = await Task.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ dueDate: 1 })
      .populate("assignedUserId", "username email");

    return res.status(200).json(
      new ApiResponse(200, {
        page: pageNum,
        limit: limitNum,
        totalTasks,
        totalPages,
        tasks
      }, "Tasks fetched successfully")
    );
  } catch (err) {
    next(err);
  }
};


// ✅ Update task
export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) throw new ApiError(404, "Task not found");

    return res.json(new ApiResponse(200, { task: updatedTask }, "Task updated"));
  } catch (err) {
    next(err);
  }
};

// ✅ Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) throw new ApiError(404, "Task not found");

    return res.json(new ApiResponse(200, null, "Task deleted"));
  } catch (err) {
    next(err);
  }
};
