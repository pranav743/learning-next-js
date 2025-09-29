const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Add a new vehicle (Owner only)
 * @route POST /api/vehicles/add
 * @access Private (Owner only)
 */
const addVehicle = asyncHandler(async (req, res) => {
  const vehicleData = {
    ...req.body,
    owner: req.user._id // Set the logged-in user as owner
  };

  // Check if vehicle number already exists
  const existingVehicle = await Vehicle.findOne({ 
    vehicleNumber: vehicleData.vehicleNumber.toUpperCase() 
  });
  
  if (existingVehicle) {
    return errorResponse(res, 'Vehicle with this number already exists', null, 400);
  }

  // Create vehicle
  const vehicle = await Vehicle.create(vehicleData);
  
  // Populate owner details
  await vehicle.populate('owner', 'firstName lastName email phoneNumber');

  successResponse(res, 'Vehicle added successfully', { vehicle }, 201);
});

/**
 * Get all vehicles by owner
 * @route GET /api/vehicles/my-vehicles
 * @access Private (Owner only)
 */
const getMyVehicles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, vehicleType, isActive } = req.query;

  // Build query for owner's vehicles
  const query = { owner: req.user._id };
  
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await Vehicle.countDocuments(query);
  
  // Get vehicles
  const vehicles = await Vehicle.find(query)
    .populate('owner', 'firstName lastName email phoneNumber')
    .populate('currentDriver', 'firstName lastName email phoneNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalVehicles: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Vehicles retrieved successfully', {
    vehicles,
    pagination
  });
});

/**
 * Get all vehicles (Admin/Customer view)
 * @route GET /api/vehicles
 * @access Private
 */
const getAllVehicles = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    vehicleType, 
    city, 
    state, 
    isActive = true,
    available 
  } = req.query;

  // Build query
  const query = { isActive: isActive === 'true' };
  
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }
  
  if (city) {
    query['location.city'] = new RegExp(city, 'i');
  }
  
  if (state) {
    query['location.state'] = new RegExp(state, 'i');
  }
  
  // Filter for available vehicles (no current driver)
  if (available === 'true') {
    query.currentDriver = { $exists: false };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await Vehicle.countDocuments(query);
  
  // Get vehicles
  const vehicles = await Vehicle.find(query)
    .populate('owner', 'firstName lastName email phoneNumber')
    .populate('currentDriver', 'firstName lastName email phoneNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalVehicles: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Vehicles retrieved successfully', {
    vehicles,
    pagination
  });
});

/**
 * Get vehicle by ID
 * @route GET /api/vehicles/:id
 * @access Private
 */
const getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id)
    .populate('owner', 'firstName lastName email phoneNumber')
    .populate('currentDriver', 'firstName lastName email phoneNumber');

  if (!vehicle) {
    return errorResponse(res, 'Vehicle not found', null, 404);
  }

  // Check if user has permission to view this vehicle
  const isOwner = vehicle.owner._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isCustomer = req.user.role === 'customer';
  const isDriver = req.user.role === 'driver' && 
                   vehicle.currentDriver && 
                   vehicle.currentDriver._id.toString() === req.user._id.toString();

  if (!isOwner && !isAdmin && !isCustomer && !isDriver) {
    return errorResponse(res, 'Access denied', null, 403);
  }

  successResponse(res, 'Vehicle retrieved successfully', { vehicle });
});

/**
 * Update vehicle (Owner only)
 * @route PUT /api/vehicles/:id
 * @access Private (Owner only)
 */
const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Find vehicle
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return errorResponse(res, 'Vehicle not found', null, 404);
  }

  // Check if user is the owner
  if (vehicle.owner.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Access denied. You can only update your own vehicles.', null, 403);
  }

  // Check if vehicle number is being changed and already exists
  if (updateData.vehicleNumber && updateData.vehicleNumber !== vehicle.vehicleNumber) {
    const existingVehicle = await Vehicle.findOne({ 
      vehicleNumber: updateData.vehicleNumber.toUpperCase(),
      _id: { $ne: id }
    });
    
    if (existingVehicle) {
      return errorResponse(res, 'Vehicle with this number already exists', null, 400);
    }
  }

  // Update vehicle
  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).populate('owner', 'firstName lastName email phoneNumber')
   .populate('currentDriver', 'firstName lastName email phoneNumber');

  successResponse(res, 'Vehicle updated successfully', { vehicle: updatedVehicle });
});

/**
 * Delete/Deactivate vehicle (Owner only)
 * @route DELETE /api/vehicles/:id
 * @access Private (Owner only)
 */
const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find vehicle
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return errorResponse(res, 'Vehicle not found', null, 404);
  }

  // Check if user is the owner
  if (vehicle.owner.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Access denied. You can only delete your own vehicles.', null, 403);
  }

  // Soft delete by setting isActive to false
  vehicle.isActive = false;
  await vehicle.save();

  successResponse(res, 'Vehicle deactivated successfully');
});

/**
 * Assign driver to vehicle (Owner only)
 * @route PUT /api/vehicles/:id/assign-driver
 * @access Private (Owner only)
 */
const assignDriverToVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;

  // Find vehicle
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    return errorResponse(res, 'Vehicle not found', null, 404);
  }

  // Check if user is the owner
  if (vehicle.owner.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Access denied. You can only assign drivers to your own vehicles.', null, 403);
  }

  // Find and validate driver
  if (driverId) {
    const driver = await User.findById(driverId);
    if (!driver) {
      return errorResponse(res, 'Driver not found', null, 404);
    }
    
    if (driver.role !== 'driver') {
      return errorResponse(res, 'User is not a driver', null, 400);
    }
    
    if (!driver.isActive) {
      return errorResponse(res, 'Driver account is not active', null, 400);
    }

    vehicle.currentDriver = driverId;
  } else {
    // Remove driver assignment
    vehicle.currentDriver = undefined;
  }

  await vehicle.save();
  await vehicle.populate('currentDriver', 'firstName lastName email phoneNumber');

  const message = driverId ? 'Driver assigned successfully' : 'Driver unassigned successfully';
  successResponse(res, message, { vehicle });
});

/**
 * Get available vehicles in a location
 * @route GET /api/vehicles/available
 * @access Private (Customer only)
 */
const getAvailableVehicles = asyncHandler(async (req, res) => {
  const { city, state, vehicleType, page = 1, limit = 10 } = req.query;

  if (!city || !state) {
    return errorResponse(res, 'City and state are required', null, 400);
  }

  // Build query for available vehicles
  const query = {
    isActive: true,
    currentDriver: { $exists: false }, // No driver assigned means available
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i')
  };

  if (vehicleType) {
    query.vehicleType = vehicleType;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await Vehicle.countDocuments(query);
  
  // Get available vehicles
  const vehicles = await Vehicle.find(query)
    .populate('owner', 'firstName lastName email phoneNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalVehicles: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Available vehicles retrieved successfully', {
    vehicles,
    pagination
  });
});

/**
 * Get vehicle statistics (Admin/Owner)
 * @route GET /api/vehicles/stats
 * @access Private (Admin/Owner)
 */
const getVehicleStats = asyncHandler(async (req, res) => {
  let matchQuery = { isActive: true };
  
  // If user is owner, only show their vehicles
  if (req.user.role === 'owner') {
    matchQuery.owner = req.user._id;
  }

  const stats = await Vehicle.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$vehicleType',
        count: { $sum: 1 },
        available: {
          $sum: {
            $cond: [{ $exists: ['$currentDriver', false] }, 1, 0]
          }
        },
        assigned: {
          $sum: {
            $cond: [{ $exists: ['$currentDriver', true] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        vehicleType: '$_id',
        totalVehicles: '$count',
        availableVehicles: '$available',
        assignedVehicles: '$assigned',
        _id: 0
      }
    }
  ]);

  const totalVehicles = await Vehicle.countDocuments(matchQuery);
  const availableVehicles = await Vehicle.countDocuments({
    ...matchQuery,
    currentDriver: { $exists: false }
  });

  successResponse(res, 'Vehicle statistics retrieved successfully', {
    overview: {
      totalVehicles,
      availableVehicles,
      assignedVehicles: totalVehicles - availableVehicles
    },
    typeWiseStats: stats
  });
});

module.exports = {
  addVehicle,
  getMyVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  assignDriverToVehicle,
  getAvailableVehicles,
  getVehicleStats
};