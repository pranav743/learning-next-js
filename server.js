const express = require('express');
const path = require('path');

const blogRoutes = require('./routes/blogRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use('/blogs', blogRoutes);
app.use('/images', imageRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Blog Management API',
    version: '1.0.0',
    endpoints: {
      blogs: {
        'POST /blogs/create': 'Create a new blog (with optional image upload)',
        'GET /blogs/': 'Get all blogs',
        'GET /blogs/:id': 'Get a single blog by id',
        'PUT /blogs/:id': 'Update a blog',
        'DELETE /blogs/:id': 'Delete a blog'
      },
      images: {
        'GET /images/:filename': 'Get image file if exists, otherwise 404'
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: {
      blogs: '/blogs',
      images: '/images'
    }
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Blog Management API is running on port ${PORT}`);
  console.log(`📂 API Documentation: http://localhost:${PORT}/`);
  console.log(`📝 Blog endpoints: http://localhost:${PORT}/blogs`);
  console.log(`🖼️  Image endpoints: http://localhost:${PORT}/images`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST   /blogs/create     - Create a new blog');
  console.log('  GET    /blogs/           - Get all blogs');
  console.log('  GET    /blogs/:id        - Get blog by ID');
  console.log('  PUT    /blogs/:id        - Update blog by ID');
  console.log('  DELETE /blogs/:id        - Delete blog by ID');
  console.log('  GET    /images/:filename - Serve image files');
});