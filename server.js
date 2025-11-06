import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import blogRoutes from './routes/blogRoutes.js'
import logger from './middlewares/logger.js'
import errorHandler from './middlewares/errorHandler.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(logger)
app.use('/api', blogRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
