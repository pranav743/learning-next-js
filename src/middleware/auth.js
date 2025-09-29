const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { errorResponse } = require('../utils/helpers');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return errorResponse(res, 'Access token is required', null, 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return errorResponse(res, 'User not found or token is invalid', null, 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is deactivated', null, 401);
    }

    // Attach user information to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.message === 'Token has expired') {
      return errorResponse(res, 'Token has expired. Please login again.', null, 401);
    } else if (error.message === 'Invalid token') {
      return errorResponse(res, 'Invalid token provided', null, 401);
    } else {
      return errorResponse(res, 'Authentication failed', null, 401);
    }
  }
};

/**
 * Authorization middleware to check user roles (RBAC)
 * @param  {...string} allowedRoles - Roles that can access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (should be called after authenticate middleware)
      if (!req.user) {
        return errorResponse(res, 'User not authenticated', null, 401);
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return errorResponse(
          res, 
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`, 
          null, 
          403
        );
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error.message);
      return errorResponse(res, 'Authorization failed', null, 403);
    }
  };
};

/**
 * Middleware to check if user can access their own resources or is admin
 */
const authorizeOwnerOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', null, 401);
    }

    const userIdFromParams = req.params.id || req.params.userId;
    const isOwner = req.user._id.toString() === userIdFromParams;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return errorResponse(
        res, 
        'Access denied. You can only access your own resources or must be an admin.', 
        null, 
        403
      );
    }

    next();
  } catch (error) {
    console.error('Owner/Admin authorization error:', error.message);
    return errorResponse(res, 'Authorization failed', null, 403);
  }
};

/**
 * Optional authentication middleware - does not fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid/expired
    console.log('Optional auth failed:', error.message);
    next();
  }
};

/**
 * Middleware to check if user is accessing assigned trips (for drivers)
 */
const authorizeDriverTrips = async (req, res, next) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'User not authenticated', null, 401);
    }

    // Only drivers need this check
    if (req.user.role !== 'driver') {
      return next();
    }

    const tripId = req.params.tripId || req.params.id;
    
    if (tripId) {
      const Trip = require('../models/Trip');
      const trip = await Trip.findById(tripId);
      
      if (!trip) {
        return errorResponse(res, 'Trip not found', null, 404);
      }

      if (trip.driver.toString() !== req.user._id.toString()) {
        return errorResponse(
          res, 
          'Access denied. You can only access trips assigned to you.', 
          null, 
          403
        );
      }
    }

    next();
  } catch (error) {
    console.error('Driver trip authorization error:', error.message);
    return errorResponse(res, 'Authorization failed', null, 403);
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin,
  optionalAuth,
  authorizeDriverTrips
};