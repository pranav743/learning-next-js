const express = require('express');
const router = express.Router();

// Controllers
const {
  bookTrip,
  getMyTrips,
  getDriverTrips,
  getAllTrips,
  getTripById,
  updateTripStatus,
  cancelTrip,
  getTripStats
} = require('../controllers/tripController');

// Middleware
const { authenticate, authorize, authorizeDriverTrips } = require('../middleware/auth');
const { 
  validateTripBooking,
  validateTripStatusUpdate,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');
const { handleValidationErrors } = require('../middleware/errorHandler');
const { tripBookingRateLimit } = require('../middleware/rateLimiting');

// All routes require authentication
router.use(authenticate);

// Book a new trip (Customer only)
router.post('/book', 
  authorize('customer'),
  tripBookingRateLimit,
  validateTripBooking, 
  handleValidationErrors, 
  bookTrip
);

// Get all trips (Admin only)
router.get('/', 
  authorize('admin'),
  validatePagination,
  handleValidationErrors,
  getAllTrips
);

// Get customer's own trips
router.get('/my-trips', 
  authorize('customer'),
  validatePagination,
  handleValidationErrors,
  getMyTrips
);

// Get driver's assigned trips (Driver only)
router.get('/driver-trips', 
  authorize('driver'),
  validatePagination,
  handleValidationErrors,
  getDriverTrips
);

// Get trip statistics
router.get('/stats', 
  authorize('admin', 'owner'),
  getTripStats
);

// Get specific trip by ID
router.get('/:id', 
  validateObjectId('id'),
  handleValidationErrors,
  authorizeDriverTrips, // Additional check for drivers to access only assigned trips
  getTripById
);

// Update trip status (Driver can update assigned trips, Admin can update any)
router.put('/:id/status', 
  authorize('driver', 'admin'),
  validateObjectId('id'),
  validateTripStatusUpdate,
  handleValidationErrors,
  authorizeDriverTrips, // Ensure drivers can only update their assigned trips
  updateTripStatus
);

// Cancel trip (Customer can cancel their trips, Admin can cancel any)
router.put('/:id/cancel', 
  authorize('customer', 'admin'),
  validateObjectId('id'),
  handleValidationErrors,
  cancelTrip
);

module.exports = router;