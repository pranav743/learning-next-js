const express = require('express');
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser,
  getAllUsers,
  deleteUser,
  getUserStats
} = require('../controllers/authController');

// Middleware
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');
const { handleValidationErrors } = require('../middleware/errorHandler');
const { authRateLimit } = require('../middleware/rateLimiting');

// Public routes
router.post('/register', 
  authRateLimit,
  validateUserRegistration, 
  handleValidationErrors, 
  registerUser
);

router.post('/login', 
  authRateLimit,
  validateUserLogin, 
  handleValidationErrors, 
  loginUser
);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', 
  validatePasswordUpdate, 
  handleValidationErrors, 
  changePassword
);
router.post('/logout', logoutUser);

// Admin only routes
router.get('/users', 
  authorize('admin'), 
  validatePagination,
  handleValidationErrors,
  getAllUsers
);

router.get('/stats', 
  authorize('admin'), 
  getUserStats
);

// Route for deleting users (Admin only) - as specified in requirements
router.delete('/users/delete/:id', 
  authorize('admin'),
  validateObjectId('id'),
  handleValidationErrors,
  deleteUser
);

module.exports = router;