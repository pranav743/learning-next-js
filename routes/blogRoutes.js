const express = require('express');
const multer = require('multer');
const path = require('path');
const BlogController = require('../controllers/blogController');
const validateBlogMiddleware = require('../middlewares/validateBlog');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post('/create', upload.single('image'), validateBlogMiddleware, BlogController.createBlog);

router.get('/', BlogController.getAllBlogs);

router.get('/:id', BlogController.getBlogById);

router.put('/:id', upload.single('image'), validateBlogMiddleware, BlogController.updateBlog);

router.delete('/:id', BlogController.deleteBlog);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'File size too large. Maximum size allowed is 5MB.'
      });
    }
    return res.status(400).json({
      error: 'Bad Request',
      message: 'File upload error: ' + error.message
    });
  }
  
  if (error.message === 'Only image files (JPEG, PNG, GIF, WebP) are allowed!') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid file type. Only image files (JPEG, PNG, GIF, WebP) are allowed.'
    });
  }
  
  next(error);
});

module.exports = router;