import User from '../models/User.js'
import bcrypt from 'bcryptjs'
async function createUser(username, password) {
  const hash = await bcrypt.hash(password, 10)
  return User.create({ username, password: hash })
}
async function findUserByUsername(username) {
  return User.findOne({ username })
}
async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password)
}
export { createUser, findUserByUsername, validatePassword }
