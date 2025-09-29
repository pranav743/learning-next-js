const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return errorResponse(
      res, 
      'Validation failed', 
      formattedErrors, 
      400
    );
  }
  
  next();
};

/**
 * Catch async errors and pass to error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Invalid resource ID format';
    return errorResponse(res, message, null, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return errorResponse(res, message, null, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    return errorResponse(res, 'Validation Error', errors, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', null, 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', null, 401);
  }

  // Default error
  return errorResponse(
    res, 
    error.message || 'Internal Server Error', 
    null, 
    error.statusCode || 500
  );
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  return errorResponse(res, message, null, 404);
};

/**
 * Log requests middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`;
    
    if (res.statusCode >= 400) {
      console.error(`❌ ${logMessage}`);
    } else {
      console.log(`✅ ${logMessage}`);
    }
  });

  next();
};

module.exports = {
  handleValidationErrors,
  asyncHandler,
  errorHandler,
  notFound,
  requestLogger
};