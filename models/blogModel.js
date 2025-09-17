const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

class BlogModel {
  static readData() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return { blogs: [] };
    }
  }

  static writeData(data) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing to database:', error);
      return false;
    }
  }

  static getAllBlogs() {
    const data = this.readData();
    return data.blogs || [];
  }

  static getBlogById(id) {
    const data = this.readData();
    const blogs = data.blogs || [];
    return blogs.find(blog => blog.id === parseInt(id));
  }

  static createBlog(blogData) {
    const data = this.readData();
    const blogs = data.blogs || [];
    
    const newId = blogs.length > 0 ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;
    
    const newBlog = {
      id: newId,
      title: blogData.title,
      content: blogData.content,
      image: blogData.image || null
    };
    
    blogs.push(newBlog);
    data.blogs = blogs;
    
    if (this.writeData(data)) {
      return newBlog;
    }
    return null;
  }

  static updateBlog(id, updatedData) {
    const data = this.readData();
    const blogs = data.blogs || [];
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
    
    if (blogIndex === -1) {
      return null;
    }
    
    if (updatedData.title !== undefined) {
      blogs[blogIndex].title = updatedData.title;
    }
    if (updatedData.content !== undefined) {
      blogs[blogIndex].content = updatedData.content;
    }
    if (updatedData.image !== undefined) {
      blogs[blogIndex].image = updatedData.image;
    }
    
    data.blogs = blogs;
    
    if (this.writeData(data)) {
      return blogs[blogIndex];
    }
    return null;
  }

  static deleteBlog(id) {
    const data = this.readData();
    const blogs = data.blogs || [];
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
    
    if (blogIndex === -1) {
      return false;
    }
    
    const deletedBlog = blogs[blogIndex];
    blogs.splice(blogIndex, 1);
    data.blogs = blogs;
    
    if (this.writeData(data)) {
      return deletedBlog;
    }
    return false;
  }
}

module.exports = BlogModel;