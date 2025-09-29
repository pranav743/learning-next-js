const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - The payload to include in the token
 * @param {String} expiresIn - Token expiration time (default: 15m)
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '15m') => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
      issuer: 'travel-management-api',
      audience: 'travel-management-users'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {String} token - The token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'travel-management-api',
      audience: 'travel-management-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null if not found
 */
const extractTokenFromHeader = (authHeader) => {
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  return null;
};

/**
 * Generate refresh token (longer expiry)
 * @param {Object} payload - The payload to include in the token
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d', // 7 days for refresh token
      issuer: 'travel-management-api',
      audience: 'travel-management-users'
    });
  } catch (error) {
    throw new Error('Refresh token generation failed');
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {String} token - Token to decode
 * @returns {Object} Decoded token
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  generateRefreshToken,
  decodeToken
};