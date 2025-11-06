import Blog from '../models/Blog.js'

export const createBlog = async (req, res, next) => {
  try {
    const blog = new Blog(req.body)
    await blog.save()
    res.status(201).json({ success: true, data: blog })
  } catch (err) {
    next(err)
  }
}

export const getBlogs = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.category) {
      filter.category = req.query.category
    }
    const blogs = await Blog.find(filter)
    res.json({ success: true, data: blogs })
  } catch (err) {
    next(err)
  }
}

export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    blog.views += 1
    await blog.save()
    res.json({ success: true, data: blog })
  } catch (err) {
    next(err)
  }
}

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    Object.assign(blog, req.body)
    await blog.save()
    res.json({ success: true, data: blog })
  } catch (err) {
    next(err)
  }
}

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    res.json({ success: true, data: blog })
  } catch (err) {
    next(err)
  }
}
