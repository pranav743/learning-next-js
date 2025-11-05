import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
connectDB()
app.use('/api', authRoutes)
app.use('/api/books', bookRoutes)
app.use((req, res) => res.status(404).json({ error: 'Not found' }))
export default app
