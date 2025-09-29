require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDatabase = require('./config/database');

// Import middleware
const { generalRateLimit } = require('./middleware/rateLimiting');
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Initialize Express app
const app = express();

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(generalRateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel Management API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Travel Management API',
    version: '1.0.0',
    documentation: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password',
        logout: 'POST /api/auth/logout',
        getAllUsers: 'GET /api/auth/users (Admin only)',
        deleteUser: 'DELETE /api/auth/users/delete/:id (Admin only)',
        getUserStats: 'GET /api/auth/stats (Admin only)'
      },
      vehicles: {
        addVehicle: 'POST /api/vehicles/add (Owner only)',
        getAllVehicles: 'GET /api/vehicles',
        getMyVehicles: 'GET /api/vehicles/my-vehicles (Owner only)',
        getAvailableVehicles: 'GET /api/vehicles/available (Customer only)',
        getVehicleById: 'GET /api/vehicles/:id',
        updateVehicle: 'PUT /api/vehicles/:id (Owner only)',
        deleteVehicle: 'DELETE /api/vehicles/:id (Owner only)',
        assignDriver: 'PUT /api/vehicles/:id/assign-driver (Owner only)',
        getVehicleStats: 'GET /api/vehicles/stats (Admin/Owner only)'
      },
      trips: {
        bookTrip: 'POST /api/trips/book (Customer only)',
        getAllTrips: 'GET /api/trips (Admin only)',
        getMyTrips: 'GET /api/trips/my-trips (Customer only)',
        getDriverTrips: 'GET /api/trips/driver-trips (Driver only)',
        getTripById: 'GET /api/trips/:id',
        updateTripStatus: 'PUT /api/trips/:id/status (Driver/Admin only)',
        cancelTrip: 'PUT /api/trips/:id/cancel (Customer/Admin only)',
        getTripStats: 'GET /api/trips/stats (Admin/Owner only)'
      }
    },
    roles: {
      admin: 'Can delete users, view all data, manage system',
      owner: 'Can add vehicles, assign drivers, view vehicle/trip stats',
      driver: 'Can view and update assigned trips only',
      customer: 'Can book trips, view own trips, view available vehicles'
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      expiry: '15 minutes',
      note: 'Token must be included in Authorization header for protected routes'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);

// Handle undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Travel Management API Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;