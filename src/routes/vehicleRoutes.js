const express = require('express');
const router = express.Router();

// Controllers
const {
  addVehicle,
  getMyVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  assignDriverToVehicle,
  getAvailableVehicles,
  getVehicleStats
} = require('../controllers/vehicleController');

// Middleware
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');
const { 
  validateVehicleCreation,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');
const { handleValidationErrors } = require('../middleware/errorHandler');
const { vehicleCreationRateLimit } = require('../middleware/rateLimiting');

// All routes require authentication
router.use(authenticate);

// Route for adding vehicles (Owner only) - as specified in requirements
router.post('/add', 
  authorize('owner'),
  vehicleCreationRateLimit,
  validateVehicleCreation, 
  handleValidationErrors, 
  addVehicle
);

// Get all vehicles (different access levels)
router.get('/', 
  validatePagination,
  handleValidationErrors,
  getAllVehicles
);

// Get available vehicles (for customers to book)
router.get('/available', 
  authorize('customer'),
  validatePagination,
  handleValidationErrors,
  getAvailableVehicles
);

// Get vehicles owned by current user (Owner only)
router.get('/my-vehicles', 
  authorize('owner'),
  validatePagination,
  handleValidationErrors,
  getMyVehicles
);

// Get vehicle statistics
router.get('/stats', 
  authorize('admin', 'owner'),
  getVehicleStats
);

// Get specific vehicle by ID
router.get('/:id', 
  validateObjectId('id'),
  handleValidationErrors,
  getVehicleById
);

// Update vehicle (Owner only - their own vehicles)
router.put('/:id', 
  authorize('owner'),
  validateObjectId('id'),
  validateVehicleCreation,
  handleValidationErrors,
  updateVehicle
);

// Delete/deactivate vehicle (Owner only - their own vehicles)
router.delete('/:id', 
  authorize('owner'),
  validateObjectId('id'),
  handleValidationErrors,
  deleteVehicle
);

// Assign/unassign driver to vehicle (Owner only)
router.put('/:id/assign-driver', 
  authorize('owner'),
  validateObjectId('id'),
  handleValidationErrors,
  assignDriverToVehicle
);

module.exports = router;