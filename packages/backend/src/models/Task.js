/**
 * Task Model
 * Provides database access methods for task operations
 */

const Database = require('better-sqlite3');

// Initialize or get existing database connection
let db = null;

function initializeDatabase() {
  if (db) return db;

  db = new Database(':memory:');

  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'incomplete',
      dueDate TEXT,
      priority TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  return db;
}

function getDatabase() {
  if (!db) {
    initializeDatabase();
  }
  return db;
}

/**
 * Clear all tasks from database (for testing)
 */
function clearAllTasks() {
  const database = getDatabase();
  const stmt = database.prepare('DELETE FROM tasks');
  stmt.run();
}

/**
 * Generate unique ID (UUID v4 alternative)
 */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new task
 */
function createTask(taskData) {
  const database = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  const {
    title,
    description = null,
    status = 'incomplete',
    dueDate = null,
    priority = null,
  } = taskData;

  const stmt = database.prepare(`
    INSERT INTO tasks (id, title, description, status, dueDate, priority, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, title, description, status, dueDate, priority, now, now);

  return getTaskById(id);
}

/**
 * Get all tasks
 */
function getAllTasks() {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM tasks');
  return stmt.all();
}

/**
 * Get task by ID
 */
function getTaskById(id) {
  const database = getDatabase();
  const stmt = database.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
}

/**
 * Update task
 */
function updateTask(id, updates) {
  const database = getDatabase();
  const task = getTaskById(id);

  if (!task) {
    return null;
  }

  const now = new Date().toISOString();
  const {
    title = task.title,
    description = task.description,
    status = task.status,
    dueDate = task.dueDate,
    priority = task.priority,
  } = updates;

  const stmt = database.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, status = ?, dueDate = ?, priority = ?, updatedAt = ?
    WHERE id = ?
  `);

  stmt.run(title, description, status, dueDate, priority, now, id);

  return getTaskById(id);
}

/**
 * Delete task
 */
function deleteTask(id) {
  const database = getDatabase();
  const task = getTaskById(id);

  if (!task) {
    return false;
  }

  const stmt = database.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);

  return true;
}

/**
 * Filter tasks by status
 */
function filterByStatus(status) {
  const database = getDatabase();
  if (status === 'all') {
    return getAllTasks();
  }

  const stmt = database.prepare('SELECT * FROM tasks WHERE status = ?');
  return stmt.all(status);
}

/**
 * Sort tasks
 */
function sortTasks(tasks, sortBy = 'dueDate') {
  const tasksCopy = [...tasks];

  switch (sortBy) {
    case 'dueDate':
      return tasksCopy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

    case 'status':
      return tasksCopy.sort((a, b) => {
        if (a.status === 'incomplete' && b.status !== 'incomplete') return -1;
        if (a.status !== 'incomplete' && b.status === 'incomplete') return 1;
        return 0;
      });

    case 'createdAt':
      return tasksCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    default:
      return tasksCopy;
  }
}

/**
 * Check if task is overdue
 */
function isOverdue(task) {
  if (!task.dueDate) return false;
  return new Date(task.dueDate) < new Date() && task.status !== 'complete';
}

module.exports = {
  initializeDatabase,
  getDatabase,
  clearAllTasks,
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  filterByStatus,
  sortTasks,
  isOverdue,
};
