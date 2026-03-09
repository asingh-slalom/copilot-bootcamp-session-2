/**
 * Todo Controller
 * Handles all task-related business logic and API responses
 */

const TaskModel = require('../models/Task');

/**
 * Create a new task
 * POST /api/tasks
 */
function createTask(req, res) {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid dueDate format' });
    }

    if (status && !['incomplete', 'complete'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "incomplete" or "complete"' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be "low", "medium", or "high"' });
    }

    const task = TaskModel.createTask({
      title: title.trim(),
      description,
      status,
      dueDate,
      priority,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
}

/**
 * Get all tasks with optional filtering and sorting
 * GET /api/tasks?filter=all&sortBy=dueDate
 */
function getAllTasks(req, res) {
  try {
    const { filter = 'all', sortBy = 'dueDate' } = req.query;

    // Validate filter parameter
    if (!['all', 'incomplete', 'complete'].includes(filter)) {
      return res.status(400).json({ error: 'Filter must be "all", "incomplete", or "complete"' });
    }

    // Validate sortBy parameter
    if (!['dueDate', 'status', 'createdAt'].includes(sortBy)) {
      return res.status(400).json({ error: 'SortBy must be "dueDate", "status", or "createdAt"' });
    }

    let tasks = TaskModel.filterByStatus(filter);
    tasks = TaskModel.sortTasks(tasks, sortBy);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = TaskModel.getTaskById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
}

/**
 * Update task
 * PUT /api/tasks/:id
 */
function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, priority } = req.body;

    // Check if task exists
    const existingTask = TaskModel.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate fields if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid dueDate format' });
    }

    if (status && !['incomplete', 'complete'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "incomplete" or "complete"' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be "low", "medium", or "high"' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (priority !== undefined) updates.priority = priority;

    const updatedTask = TaskModel.updateTask(id, updates);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
function deleteTask(req, res) {
  try {
    const { id } = req.params;

    // Check if task exists
    const task = TaskModel.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    TaskModel.deleteTask(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
