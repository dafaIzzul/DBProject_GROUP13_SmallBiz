// ============================================
// ERROR HANDLER MIDDLEWARE
// middleware/errorHandler.js
// Catches all errors and sends proper response
// ============================================

// Main error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific database errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'This record already exists';
  }
  
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'Cannot delete: This record is being used by other data';
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Invalid reference: Related record does not exist';
  }
  
  if (err.code === 'ER_BAD_FIELD_ERROR') {
    statusCode = 400;
    message = 'Invalid field in query';
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Not found handler (for undefined routes)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Async error wrapper (use this for async route handlers)
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};