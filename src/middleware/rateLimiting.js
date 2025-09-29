const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/helpers');

/**
 * General rate limiting middleware
 */
const generalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    errorResponse(res, 'Too many requests from this IP, please try again later.', null, 429);
  }
});

/**
 * Strict rate limiting for authentication routes
 */
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    errorResponse(res, 'Too many authentication attempts, please try again after 15 minutes.', null, 429);
  }
});

/**
 * Rate limiting for password reset requests
 */
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many password reset attempts, please try again after 1 hour.', null, 429);
  }
});

/**
 * Rate limiting for vehicle creation (owners only)
 */
const vehicleCreationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 vehicle creation requests per hour
  message: {
    success: false,
    message: 'Too many vehicle creation attempts, please try again after 1 hour.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many vehicle creation attempts, please try again after 1 hour.', null, 429);
  }
});

/**
 * Rate limiting for trip booking (customers)
 */
const tripBookingRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 trip booking requests per 10 minutes
  message: {
    success: false,
    message: 'Too many trip booking attempts, please try again after 10 minutes.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many trip booking attempts, please try again after 10 minutes.', null, 429);
  }
});

module.exports = {
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  vehicleCreationRateLimit,
  tripBookingRateLimit
};