/**
 * Helper Utilities for TODO App
 * Includes date formatting, filtering, and sorting functions
 */

/**
 * Format a date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "Mar 15, 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Check if a task is overdue
 * @param {object} task - Task object with dueDate and status
 * @returns {boolean} True if task is overdue and not completed
 */
export function isOverdue(task) {
  if (!task.dueDate) return false;
  if (task.status === 'complete') return false;
  return new Date(task.dueDate) < new Date();
}

/**
 * Get priority color based on priority level
 * @param {string} priority - Priority level (low, medium, high)
 * @returns {string} Color value for MUI
 */
export function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return '#d32f2f';
    case 'medium':
      return '#f57c00';
    case 'low':
      return '#388e3c';
    default:
      return '#757575';
  }
}

/**
 * Get priority badge label
 * @param {string} priority - Priority level
 * @returns {string} Upper case priority label
 */
export function getPriorityLabel(priority) {
  if (!priority) return '';
  return priority.toUpperCase();
}

/**
 * Filter tasks by status
 * @param {array} tasks - Array of task objects
 * @param {string} filter - Filter type (all, incomplete, complete)
 * @returns {array} Filtered tasks
 */
export function filterTasks(tasks, filter) {
  if (filter === 'all') return tasks;
  if (filter === 'incomplete') {
    return tasks.filter(task => task.status === 'incomplete');
  }
  if (filter === 'complete') {
    return tasks.filter(task => task.status === 'complete');
  }
  return tasks;
}

/**
 * Sort tasks by specified criterion
 * @param {array} tasks - Array of task objects
 * @param {string} sortBy - Sort criterion (dueDate, status, createdAt)
 * @returns {array} Sorted tasks
 */
export function sortTasks(tasks, sortBy) {
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
      return tasksCopy.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    default:
      return tasksCopy;
  }
}

/**
 * Validate task data
 * @param {object} taskData - Task data to validate
 * @returns {object} { isValid: boolean, errors: array of error messages }
 */
export function validateTask(taskData) {
  const errors = [];

  if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (taskData.dueDate && isNaN(new Date(taskData.dueDate).getTime())) {
    errors.push('Invalid due date');
  }

  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
    errors.push('Invalid priority');
  }

  if (taskData.status && !['incomplete', 'complete'].includes(taskData.status)) {
    errors.push('Invalid status');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Debounce function to limit API calls
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
