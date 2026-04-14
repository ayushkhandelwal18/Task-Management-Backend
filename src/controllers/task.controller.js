const Task = require('../models/Task');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, category } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required and cannot be empty',
        data: null
      });
    }

    const task = new Task({ title, description, dueDate, category });
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, completed } = req.query;
    
    const query = {};
    if (completed !== undefined) {
      if (completed === 'true') query.completed = true;
      else if (completed === 'false') query.completed = false;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, category } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID', data: null });
    }

    const updateFields = {};
    if (title !== undefined) {
        if (title.trim() === '') {
            return res.status(400).json({ success: false, message: 'Task title cannot be empty', data: null });
        }
        updateFields.title = title;
    }
    if (description !== undefined) updateFields.description = description;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (category !== undefined) updateFields.category = category;

    const task = await Task.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', data: null });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.markTaskCompleted = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID', data: null });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', data: null });
    }

    if (task.completed) {
      return res.status(400).json({ success: false, message: 'Task is already completed', data: null });
    }

    task.completed = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task marked as completed',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid task ID', data: null });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found', data: null });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
