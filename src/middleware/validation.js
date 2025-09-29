const { body, param, query } = require('express-validator');

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .isIn(['admin', 'owner', 'driver', 'customer'])
    .withMessage('Role must be one of: admin, owner, driver, customer'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('phoneNumber')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number')
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Vehicle creation validation
 */
const validateVehicleCreation = [
  body('vehicleNumber')
    .trim()
    .toUpperCase()
    .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
    .withMessage('Please provide a valid Indian vehicle number (e.g., MH12AB1234)'),
  
  body('vehicleType')
    .isIn(['car', 'bus', 'truck', 'motorcycle', 'auto-rickshaw', 'tempo'])
    .withMessage('Vehicle type must be one of: car, bus, truck, motorcycle, auto-rickshaw, tempo'),
  
  body('make')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle make must be between 2 and 50 characters'),
  
  body('model')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle model must be between 2 and 50 characters'),
  
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage(`Year must be between 1990 and ${new Date().getFullYear()}`),
  
  body('capacity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Capacity must be between 1 and 100'),
  
  body('fuelType')
    .isIn(['petrol', 'diesel', 'cng', 'electric', 'hybrid'])
    .withMessage('Fuel type must be one of: petrol, diesel, cng, electric, hybrid'),
  
  body('registrationDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid registration date'),
  
  body('insuranceExpiry')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Insurance expiry date must be in the future');
      }
      return true;
    }),
  
  body('pucExpiry')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('PUC expiry date must be in the future');
      }
      return true;
    }),
  
  body('location.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('City is required'),
  
  body('location.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('State is required'),
  
  body('location.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit Indian pincode'),
  
  body('averageMileage')
    .optional()
    .isFloat({ min: 5, max: 50 })
    .withMessage('Average mileage must be between 5 and 50 km/l')
];

/**
 * Trip booking validation
 */
const validateTripBooking = [
  body('vehicle')
    .isMongoId()
    .withMessage('Please provide a valid vehicle ID'),
  
  body('source.address')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Source address is required and must be at least 5 characters'),
  
  body('source.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Source city is required'),
  
  body('source.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Source state is required'),
  
  body('source.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid source pincode'),
  
  body('destination.address')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Destination address is required and must be at least 5 characters'),
  
  body('destination.city')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Destination city is required'),
  
  body('destination.state')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Destination state is required'),
  
  body('destination.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid destination pincode'),
  
  body('scheduledStartTime')
    .isISO8601()
    .toDate()
    .custom((value) => {
      const scheduledTime = new Date(value);
      const now = new Date();
      if (scheduledTime <= now) {
        throw new Error('Scheduled start time must be in the future');
      }
      return true;
    }),
  
  body('scheduledEndTime')
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      const endTime = new Date(value);
      const startTime = new Date(req.body.scheduledStartTime);
      if (endTime <= startTime) {
        throw new Error('Scheduled end time must be after start time');
      }
      return true;
    }),
  
  body('fare.baseFare')
    .isFloat({ min: 0 })
    .withMessage('Base fare must be a positive number'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'upi', 'wallet'])
    .withMessage('Payment method must be one of: cash, card, upi, wallet'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`)
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Password update validation
 */
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

/**
 * Trip status update validation
 */
const validateTripStatusUpdate = [
  body('status')
    .isIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: scheduled, in_progress, completed, cancelled'),
  
  body('actualStartTime')
    .optional()
    .isISO8601()
    .toDate(),
  
  body('actualEndTime')
    .optional()
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (value && req.body.actualStartTime) {
        const endTime = new Date(value);
        const startTime = new Date(req.body.actualStartTime);
        if (endTime <= startTime) {
          throw new Error('Actual end time must be after start time');
        }
      }
      return true;
    })
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateVehicleCreation,
  validateTripBooking,
  validateObjectId,
  validatePagination,
  validatePasswordUpdate,
  validateTripStatusUpdate
};