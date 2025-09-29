/**
 * Success response helper
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response helper
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Object} errors - Detailed errors
 * @param {Number} statusCode - HTTP status code (default: 400)
 */
const errorResponse = (res, message, errors = null, statusCode = 400) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Pagination helper
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @param {Number} total - Total items count
 * @returns {Object} Pagination metadata
 */
const getPaginationData = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Array} Array of missing fields
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      missingFields.push(field);
    }
  });

  return missingFields;
};

/**
 * Sanitize user data (remove sensitive fields)
 * @param {Object} user - User object
 * @returns {Object} Sanitized user object
 */
const sanitizeUserData = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

/**
 * Generate random string
 * @param {Number} length - Length of random string
 * @returns {String} Random string
 */
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format Indian phone number
 * @param {String} phone - Phone number
 * @returns {String} Formatted phone number
 */
const formatIndianPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +91 if not present and number is 10 digits
  if (cleaned.length === 10 && !cleaned.startsWith('91')) {
    return `+91${cleaned}`;
  }
  
  // Add + if not present and number starts with 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  return phone;
};

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {Boolean} True if date is in the past
 */
const isDateInPast = (date) => {
  return new Date(date) < new Date();
};

/**
 * Calculate age from date of birth
 * @param {Date} dateOfBirth - Date of birth
 * @returns {Number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

module.exports = {
  successResponse,
  errorResponse,
  getPaginationData,
  validateRequiredFields,
  sanitizeUserData,
  generateRandomString,
  formatIndianPhoneNumber,
  isDateInPast,
  calculateAge
};