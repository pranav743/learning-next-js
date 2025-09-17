const BlogModel = require('../models/blogModel');
const fs = require('fs');
const path = require('path');

class BlogController {
  static createBlog(req, res) {
    try {
      const blogData = {
        title: req.body.title,
        content: req.body.content,
        image: req.file ? req.file.path : null
      };

      const newBlog = BlogModel.createBlog(blogData);
      
      if (newBlog) {
        res.status(201).json({
          message: 'Blog created successfully',
          blog: newBlog
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to create blog'
        });
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  static getAllBlogs(req, res) {
    try {
      const blogs = BlogModel.getAllBlogs();
      res.status(200).json({
        message: 'Blogs retrieved successfully',
        count: blogs.length,
        blogs: blogs
      });
    } catch (error) {
      console.error('Error retrieving blogs:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve blogs'
      });
    }
  }

  // Get a single blog by ID
  static getBlogById(req, res) {
    try {
      const { id } = req.params;
      const blog = BlogModel.getBlogById(id);
      
      if (blog) {
        res.status(200).json({
          message: 'Blog retrieved successfully',
          blog: blog
        });
      } else {
        res.status(404).json({
          error: 'Not Found',
          message: 'Blog not found'
        });
      }
    } catch (error) {
      console.error('Error retrieving blog:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve blog'
      });
    }
  }

  // Update a blog by ID
  static updateBlog(req, res) {
    try {
      const { id } = req.params;
      
      // Check if blog exists
      const existingBlog = BlogModel.getBlogById(id);
      if (!existingBlog) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Blog not found'
        });
      }

      const updateData = {
        title: req.body.title,
        content: req.body.content
      };

      // Handle image update
      if (req.file) {
        // If there's an old image, optionally delete it
        if (existingBlog.image && fs.existsSync(existingBlog.image)) {
          try {
            fs.unlinkSync(existingBlog.image);
          } catch (err) {
            console.warn('Warning: Could not delete old image:', err);
          }
        }
        updateData.image = req.file.path;
      }

      const updatedBlog = BlogModel.updateBlog(id, updateData);
      
      if (updatedBlog) {
        res.status(200).json({
          message: 'Blog updated successfully',
          blog: updatedBlog
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to update blog'
        });
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }

  static deleteBlog(req, res) {
    try {
      const { id } = req.params;
      
      const existingBlog = BlogModel.getBlogById(id);
      if (!existingBlog) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Blog not found'
        });
      }

      const deletedBlog = BlogModel.deleteBlog(id);
      
      if (deletedBlog) {
        // Delete associated image file if it exists
        if (deletedBlog.image && fs.existsSync(deletedBlog.image)) {
          try {
            fs.unlinkSync(deletedBlog.image);
          } catch (err) {
            console.warn('Warning: Could not delete image file:', err);
          }
        }

        res.status(200).json({
          message: 'Blog deleted successfully',
          deletedBlog: deletedBlog
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to delete blog'
        });
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    }
  }
}

module.exports = BlogController;