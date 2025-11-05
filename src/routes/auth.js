import express from 'express'
import { body } from 'express-validator'
import { signup, login } from '../controllers/authController.js'
import validate from '../middlewares/validate.js'
const router = express.Router()
router.post('/signup', [body('username').isString().notEmpty(), body('password').isString().isLength({ min: 6 })], validate, signup)
router.post('/login', [body('username').isString().notEmpty(), body('password').isString().notEmpty()], validate, login)
export default router
