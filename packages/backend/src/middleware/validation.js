/**
 * Validation Middleware
 * Validates incoming request payloads for task operations
 */

function validateTaskCreation(req, res, next) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, status, priority, dueDate } = req.body;

  // Title validation if provided
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  // Status validation if provided
  if (status !== undefined && !['incomplete', 'complete'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "incomplete" or "complete"' });
  }

  // Priority validation if provided
  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be "low", "medium", or "high"' });
  }

  // DueDate validation if provided
  if (dueDate !== undefined && dueDate !== null) {
    if (isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: 'Invalid dueDate format' });
    }
  }

  next();
}

module.exports = {
  validateTaskCreation,
  validateTaskUpdate,
};
