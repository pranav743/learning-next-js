import { createUser, findUserByUsername, validatePassword } from '../services/userService.js'
import jwt from 'jsonwebtoken'
async function signup(req, res) {
  const { username, password } = req.body
  const exists = await findUserByUsername(username)
  if (exists) return res.status(409).json({ error: 'User exists' })
  const user = await createUser(username, password)
  res.status(201).json({ id: user._id, username: user.username })
}
async function login(req, res) {
  const { username, password } = req.body
  const user = await findUserByUsername(username)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await validatePassword(user, password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' })
  res.json({ token })
}
export { signup, login }
