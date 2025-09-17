const validateBlogMiddleware = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!content) missingFields.push('content');
    
    return res.status(400).json({
      error: 'Bad Request',
      message: `Missing required fields: ${missingFields.join(', ')}`,
      missingFields: missingFields
    });
  }
  
  if (title.trim() === '' || content.trim() === '') {
    const emptyFields = [];
    if (title.trim() === '') emptyFields.push('title');
    if (content.trim() === '') emptyFields.push('content');
    
    return res.status(400).json({
      error: 'Bad Request',
      message: `Fields cannot be empty: ${emptyFields.join(', ')}`,
      emptyFields: emptyFields
    });
  }
  
  next();
};

module.exports = validateBlogMiddleware;