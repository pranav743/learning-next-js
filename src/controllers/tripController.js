const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Book a new trip (Customer only)
 * @route POST /api/trips/book
 * @access Private (Customer only)
 */
const bookTrip = asyncHandler(async (req, res) => {
  const tripData = {
    ...req.body,
    customer: req.user._id
  };

  // Find and validate vehicle
  const vehicle = await Vehicle.findById(tripData.vehicle)
    .populate('owner')
    .populate('currentDriver');

  if (!vehicle) {
    return errorResponse(res, 'Vehicle not found', null, 404);
  }

  if (!vehicle.isActive) {
    return errorResponse(res, 'Vehicle is not active', null, 400);
  }

  if (!vehicle.currentDriver) {
    return errorResponse(res, 'No driver assigned to this vehicle', null, 400);
  }

  // Validate driver is active
  if (!vehicle.currentDriver.isActive) {
    return errorResponse(res, 'Assigned driver is not active', null, 400);
  }

  // Check if driver is available during requested time
  const conflictingTrips = await Trip.find({
    driver: vehicle.currentDriver._id,
    status: { $in: ['scheduled', 'in_progress'] },
    $or: [
      {
        scheduledStartTime: {
          $lte: new Date(tripData.scheduledEndTime)
        },
        scheduledEndTime: {
          $gte: new Date(tripData.scheduledStartTime)
        }
      }
    ]
  });

  if (conflictingTrips.length > 0) {
    return errorResponse(res, 'Driver is not available during the requested time', null, 400);
  }

  // Set driver from vehicle
  tripData.driver = vehicle.currentDriver._id;

  // Calculate total fare
  tripData.fare.totalFare = tripData.fare.baseFare + (tripData.fare.extraCharges || 0);

  // Create trip
  const trip = await Trip.create(tripData);

  // Populate trip details
  await trip.populate([
    { path: 'customer', select: 'firstName lastName email phoneNumber' },
    { path: 'driver', select: 'firstName lastName email phoneNumber' },
    { path: 'vehicle', select: 'vehicleNumber vehicleType make model capacity' }
  ]);

  successResponse(res, 'Trip booked successfully', { trip }, 201);
});

/**
 * Get trips for customer
 * @route GET /api/trips/my-trips
 * @access Private (Customer only)
 */
const getMyTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const trips = await Trip.findByCustomer(req.user._id, status);
  
  // Apply pagination
  const skip = (page - 1) * limit;
  const paginatedTrips = trips.slice(skip, skip + parseInt(limit));
  
  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(trips.length / limit),
    totalTrips: trips.length,
    hasNextPage: page < Math.ceil(trips.length / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Trips retrieved successfully', {
    trips: paginatedTrips,
    pagination
  });
});

/**
 * Get trips assigned to driver
 * @route GET /api/trips/driver-trips
 * @access Private (Driver only)
 */
const getDriverTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const trips = await Trip.findByDriver(req.user._id, status);
  
  // Apply pagination
  const skip = (page - 1) * limit;
  const paginatedTrips = trips.slice(skip, skip + parseInt(limit));
  
  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(trips.length / limit),
    totalTrips: trips.length,
    hasNextPage: page < Math.ceil(trips.length / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Driver trips retrieved successfully', {
    trips: paginatedTrips,
    pagination
  });
});

/**
 * Get all trips (Admin only)
 * @route GET /api/trips
 * @access Private (Admin only)
 */
const getAllTrips = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    customerId, 
    driverId, 
    vehicleId,
    startDate,
    endDate 
  } = req.query;

  // Build query
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (customerId) {
    query.customer = customerId;
  }
  
  if (driverId) {
    query.driver = driverId;
  }
  
  if (vehicleId) {
    query.vehicle = vehicleId;
  }

  // Date range filter
  if (startDate || endDate) {
    query.scheduledStartTime = {};
    if (startDate) {
      query.scheduledStartTime.$gte = new Date(startDate);
    }
    if (endDate) {
      query.scheduledStartTime.$lte = new Date(endDate);
    }
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await Trip.countDocuments(query);
  
  // Get trips
  const trips = await Trip.find(query)
    .populate('customer', 'firstName lastName email phoneNumber')
    .populate('driver', 'firstName lastName email phoneNumber')
    .populate('vehicle', 'vehicleNumber vehicleType make model')
    .sort({ scheduledStartTime: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalTrips: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Trips retrieved successfully', {
    trips,
    pagination
  });
});

/**
 * Get trip by ID
 * @route GET /api/trips/:id
 * @access Private
 */
const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trip = await Trip.findById(id)
    .populate('customer', 'firstName lastName email phoneNumber')
    .populate('driver', 'firstName lastName email phoneNumber')
    .populate('vehicle', 'vehicleNumber vehicleType make model capacity owner');

  if (!trip) {
    return errorResponse(res, 'Trip not found', null, 404);
  }

  // Check if user has permission to view this trip
  const isCustomer = trip.customer._id.toString() === req.user._id.toString();
  const isDriver = trip.driver._id.toString() === req.user._id.toString();
  const isOwner = trip.vehicle.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isDriver && !isOwner && !isAdmin) {
    return errorResponse(res, 'Access denied', null, 403);
  }

  successResponse(res, 'Trip retrieved successfully', { trip });
});

/**
 * Update trip status (Driver/Admin)
 * @route PUT /api/trips/:id/status
 * @access Private (Driver/Admin)
 */
const updateTripStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, actualStartTime, actualEndTime } = req.body;

  const trip = await Trip.findById(id);
  if (!trip) {
    return errorResponse(res, 'Trip not found', null, 404);
  }

  // Check permissions
  const isDriver = trip.driver.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isDriver && !isAdmin) {
    return errorResponse(res, 'Access denied. Only assigned driver or admin can update trip status.', null, 403);
  }

  // Validate status transitions
  const validTransitions = {
    'scheduled': ['in_progress', 'cancelled'],
    'in_progress': ['completed', 'cancelled'],
    'completed': [], // Cannot change from completed
    'cancelled': [] // Cannot change from cancelled
  };

  if (!validTransitions[trip.status].includes(status)) {
    return errorResponse(res, `Cannot change status from ${trip.status} to ${status}`, null, 400);
  }

  // Update trip
  const updateData = { status };
  
  if (actualStartTime) {
    updateData.actualStartTime = new Date(actualStartTime);
  }
  
  if (actualEndTime) {
    updateData.actualEndTime = new Date(actualEndTime);
  }

  // Auto-set timestamps based on status
  if (status === 'in_progress' && !actualStartTime) {
    updateData.actualStartTime = new Date();
  }
  
  if (status === 'completed' && !actualEndTime) {
    updateData.actualEndTime = new Date();
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate([
    { path: 'customer', select: 'firstName lastName email phoneNumber' },
    { path: 'driver', select: 'firstName lastName email phoneNumber' },
    { path: 'vehicle', select: 'vehicleNumber vehicleType make model' }
  ]);

  successResponse(res, 'Trip status updated successfully', { trip: updatedTrip });
});

/**
 * Cancel trip (Customer/Admin)
 * @route PUT /api/trips/:id/cancel
 * @access Private (Customer/Admin)
 */
const cancelTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const trip = await Trip.findById(id);
  if (!trip) {
    return errorResponse(res, 'Trip not found', null, 404);
  }

  // Check permissions
  const isCustomer = trip.customer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isAdmin) {
    return errorResponse(res, 'Access denied. Only the customer or admin can cancel a trip.', null, 403);
  }

  // Check if trip can be cancelled
  if (trip.status === 'completed') {
    return errorResponse(res, 'Cannot cancel a completed trip', null, 400);
  }

  if (trip.status === 'cancelled') {
    return errorResponse(res, 'Trip is already cancelled', null, 400);
  }

  // Update trip status to cancelled
  trip.status = 'cancelled';
  if (reason) {
    trip.notes = trip.notes ? `${trip.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`;
  }
  
  await trip.save();

  await trip.populate([
    { path: 'customer', select: 'firstName lastName email phoneNumber' },
    { path: 'driver', select: 'firstName lastName email phoneNumber' },
    { path: 'vehicle', select: 'vehicleNumber vehicleType make model' }
  ]);

  successResponse(res, 'Trip cancelled successfully', { trip });
});

/**
 * Get trip statistics (Admin/Owner)
 * @route GET /api/trips/stats
 * @access Private (Admin/Owner)
 */
const getTripStats = asyncHandler(async (req, res) => {
  let matchQuery = {};
  
  // If user is owner, only show trips for their vehicles
  if (req.user.role === 'owner') {
    const vehicles = await Vehicle.find({ owner: req.user._id }).select('_id');
    const vehicleIds = vehicles.map(vehicle => vehicle._id);
    matchQuery.vehicle = { $in: vehicleIds };
  }

  const stats = await Trip.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$fare.totalFare' }
      }
    },
    {
      $project: {
        status: '$_id',
        totalTrips: '$count',
        revenue: '$totalRevenue',
        _id: 0
      }
    }
  ]);

  // Get additional statistics
  const totalTrips = await Trip.countDocuments(matchQuery);
  const totalRevenueResult = await Trip.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: '$fare.totalFare' } } }
  ]);

  const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

  // Get monthly revenue for current year
  const currentYear = new Date().getFullYear();
  const monthlyStats = await Trip.aggregate([
    {
      $match: {
        ...matchQuery,
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`)
        },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$fare.totalFare' },
        trips: { $sum: 1 }
      }
    },
    {
      $project: {
        month: '$_id',
        revenue: 1,
        trips: 1,
        _id: 0
      }
    },
    { $sort: { month: 1 } }
  ]);

  successResponse(res, 'Trip statistics retrieved successfully', {
    overview: {
      totalTrips,
      totalRevenue
    },
    statusWiseStats: stats,
    monthlyStats
  });
});

module.exports = {
  bookTrip,
  getMyTrips,
  getDriverTrips,
  getAllTrips,
  getTripById,
  updateTripStatus,
  cancelTrip,
  getTripStats
};