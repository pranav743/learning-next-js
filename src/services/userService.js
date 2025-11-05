import User from '../models/User.js'
import bcrypt from 'bcryptjs'
async function createUser(username, password, email) {
  const hash = await bcrypt.hash(password, 10)
  return User.create({ username, password: hash, email })
}
async function findUserByUsername(username) {
  return User.findOne({ username })
}
async function findUserByEmail(email) {
  return User.findOne({ email })
}
async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password)
}
export { createUser, findUserByUsername, validatePassword }
