import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    minlength: 20
  },
  author: {
    type: String,
    required: true,
    match: /^[A-Za-z\s]+$/
  },
  category: {
    type: String,
    enum: ['tech', 'lifestyle', 'education', 'travel'],
    default: 'tech'
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    required: function() {
      return this.isPublished
    }
  }
}, {
  timestamps: true,
  versionKey: false
})

blogSchema.pre('validate', function(next) {
  if (this.isPublished && !this.publishedAt) {
    this.invalidate('publishedAt', 'publishedAt is required when isPublished is true')
  }
  next()
})

const Blog = mongoose.model('Blog', blogSchema)
export default Blog
