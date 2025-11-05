import express from 'express'
import { body } from 'express-validator'
import auth from '../middlewares/auth.js'
import validate from '../middlewares/validate.js'
import { listBooks, createBook, updateBookById, deleteBookById, bulkBooks } from '../controllers/bookController.js'
const router = express.Router()
router.get('/', auth, listBooks)
router.post('/', auth, [body('title').isString().notEmpty(), body('author').isString().notEmpty()], validate, createBook)
router.put('/:id', auth, [body('title').optional().isString(), body('author').optional().isString()], validate, updateBookById)
router.delete('/:id', auth, deleteBookById)
router.post('/bulk', auth, [body('books').isArray({ min: 1 })], validate, bulkBooks)
export default router
