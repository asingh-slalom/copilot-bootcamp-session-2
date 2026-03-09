#!/usr/bin/env node

/**
 * Seed CLI
 * Standalone script to seed the database with test data
 */

const TaskModel = require('./models/Task');
const { seedDatabase } = require('./seed');

// Initialize database first
TaskModel.initializeDatabase();

// Run seed
seedDatabase();

console.log('\nSample tasks created:');
const tasks = TaskModel.getAllTasks();
tasks.forEach((task) => {
  console.log(`  - [${task.status}] ${task.title} (${task.priority} priority)`);
});
