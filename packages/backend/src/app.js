const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import models, routes, and middleware
const TaskModel = require('./models/Task');
const todoRoutes = require('./routes/todos');
const errorHandler = require('./middleware/errorHandler');
const { seedDatabase } = require('./seed');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize database and seed with sample data
TaskModel.initializeDatabase();
seedDatabase();
console.log('In-memory database initialized with sample data');

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.use('/api/tasks', todoRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;