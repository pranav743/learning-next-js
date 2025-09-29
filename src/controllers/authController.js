const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse, sanitizeUserData } = require('../utils/helpers');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, firstName, lastName, phoneNumber } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 'User with this email already exists', null, 400);
  }

  // Check if phone number already exists
  const existingPhone = await User.findOne({ phoneNumber });
  if (existingPhone) {
    return errorResponse(res, 'User with this phone number already exists', null, 400);
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    role,
    firstName,
    lastName,
    phoneNumber
  });

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  // Update last login
  await user.updateLastLogin();

  // Return success response with token and user data
  successResponse(res, 'User registered successfully', {
    token,
    user: sanitizeUserData(user)
  }, 201);
});

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field included
  const user = await User.findByEmailWithPassword(email);
  if (!user) {
    return errorResponse(res, 'Invalid email or password', null, 401);
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(res, 'Account is deactivated. Please contact support.', null, 401);
  }

  // Compare password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return errorResponse(res, 'Invalid email or password', null, 401);
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  // Update last login
  await user.updateLastLogin();

  // Return success response with token and user data
  successResponse(res, 'Login successful', {
    token,
    user: sanitizeUserData(user)
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return errorResponse(res, 'User not found', null, 404);
  }

  successResponse(res, 'User profile retrieved successfully', {
    user: sanitizeUserData(user)
  });
});

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;
  
  // Check if phone number already exists (exclude current user)
  if (phoneNumber) {
    const existingPhone = await User.findOne({ 
      phoneNumber, 
      _id: { $ne: req.user._id } 
    });
    if (existingPhone) {
      return errorResponse(res, 'Phone number already exists', null, 400);
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber && { phoneNumber }),
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );

  successResponse(res, 'Profile updated successfully', {
    user: sanitizeUserData(user)
  });
});

/**
 * Change user password
 * @route PUT /api/auth/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Verify current password
  const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return errorResponse(res, 'Current password is incorrect', null, 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  successResponse(res, 'Password changed successfully');
});

/**
 * Logout user (client-side token invalidation)
 * @route POST /api/auth/logout
 * @access Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  // Note: Since we're using stateless JWT tokens, actual logout is handled on the client side
  // by removing the token from storage. This endpoint is mainly for logging purposes.
  
  successResponse(res, 'Logged out successfully. Please remove the token from client storage.');
});

/**
 * Get all users (Admin only)
 * @route GET /api/auth/users
 * @access Private (Admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  
  // Build query
  const query = { isActive: true };
  
  if (role) {
    query.role = role;
  }
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);
  
  // Get users
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    totalUsers: total,
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };

  successResponse(res, 'Users retrieved successfully', {
    users: users.map(user => sanitizeUserData(user)),
    pagination
  });
});

/**
 * Delete user (Admin only)
 * @route DELETE /api/users/delete/:id
 * @access Private (Admin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (id === req.user._id.toString()) {
    return errorResponse(res, 'You cannot delete your own account', null, 400);
  }

  // Find and delete user
  const user = await User.findById(id);
  if (!user) {
    return errorResponse(res, 'User not found', null, 404);
  }

  // Soft delete by setting isActive to false
  user.isActive = false;
  await user.save();

  successResponse(res, `User ${user.firstName} ${user.lastName} has been deactivated successfully`);
});

/**
 * Get user statistics (Admin only)
 * @route GET /api/auth/stats
 * @access Private (Admin only)
 */
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        role: '$_id',
        totalUsers: '$count',
        activeUsers: '$active',
        inactiveUsers: { $subtract: ['$count', '$active'] },
        _id: 0
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  
  successResponse(res, 'User statistics retrieved successfully', {
    overview: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers
    },
    roleWiseStats: stats
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser,
  getAllUsers,
  deleteUser,
  getUserStats
};