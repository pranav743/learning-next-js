require('dotenv').config();
const express = require('express');
const itemsRouter = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/items', itemsRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Redis Caching Assignment - High-End Cars API',
    endpoints: {
      'GET /items': 'Fetch all cars (with caching)',
      'POST /items': 'Add a new car (invalidates cache)',
      'PUT /items/:id': 'Update a car (invalidates cache)',
      'DELETE /items/:id': 'Delete a car (invalidates cache)'
    },
    author: 'Pranav',
    description: 'Demonstrates Redis caching with cache invalidation for high-end cars data in India'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log(`   GET    http://localhost:${PORT}/items`);
  console.log(`   POST   http://localhost:${PORT}/items`);
  console.log(`   PUT    http://localhost:${PORT}/items/:id`);
  console.log(`   DELETE http://localhost:${PORT}/items/:id`);
  console.log('\n🔄 Make sure Redis is running on localhost:6379');
});