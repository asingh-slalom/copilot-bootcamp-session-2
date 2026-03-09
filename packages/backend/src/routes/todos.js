/**
 * Todo Routes
 * API endpoints for task management
 */

const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();

// Create a new task
router.post('/', todoController.createTask);

// Get all tasks with optional filtering and sorting
router.get('/', todoController.getAllTasks);

// Get a single task by ID
router.get('/:id', todoController.getTaskById);

// Update a task
router.put('/:id', todoController.updateTask);

// Delete a task
router.delete('/:id', todoController.deleteTask);

module.exports = router;
