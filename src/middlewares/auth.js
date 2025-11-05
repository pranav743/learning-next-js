import jwt from 'jsonwebtoken'
import User from '../models/User.js'
async function auth(req, res, next) {
  const header = req.headers['authorization']
  if (!header) return res.status(401).json({ error: 'No token' })
  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ error: 'Invalid user' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
export default auth
