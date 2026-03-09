/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Handle not found errors
  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = err.message;
  }

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
}

module.exports = errorHandler;
