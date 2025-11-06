const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message })
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' })
  }
  res.status(500).json({ success: false, error: 'Internal Server Error' })
}

export default errorHandler
