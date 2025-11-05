import getRedisClient from '../config/redis.js'
async function getUserBooksCacheKey(userId) {
  return `user:${userId}:books`
}
async function getUserBulkBooksKey(userId) {
  return `user:${userId}:bulkbooks`
}
async function getBooksCache(userId) {
  const client = await getRedisClient()
  if (!client) return null
  const key = await getUserBooksCacheKey(userId)
  const data = await client.get(key)
  return data ? JSON.parse(data) : null
}
async function setBooksCache(userId, books) {
  const client = await getRedisClient()
  if (!client) return
  const key = await getUserBooksCacheKey(userId)
  await client.set(key, JSON.stringify(books), { EX: 120 })
}
async function invalidateBooksCache(userId) {
  const client = await getRedisClient()
  if (!client) return
  const key = await getUserBooksCacheKey(userId)
  await client.del(key)
}
async function storeBulkBooks(userId, books) {
  const client = await getRedisClient()
  if (!client) return
  const key = await getUserBulkBooksKey(userId)
  await client.set(key, JSON.stringify(books))
}
async function getAllBulkBooksKeys() {
  const client = await getRedisClient()
  if (!client) return []
  const keys = await client.keys('user:*:bulkbooks')
  return keys
}
async function getBulkBooksByKey(key) {
  const client = await getRedisClient()
  if (!client) return null
  const data = await client.get(key)
  return data ? JSON.parse(data) : null
}
async function deleteBulkBooksKey(key) {
  const client = await getRedisClient()
  if (!client) return
  await client.del(key)
}
export { getBooksCache, setBooksCache, invalidateBooksCache, storeBulkBooks, getAllBulkBooksKeys, getBulkBooksByKey, deleteBulkBooksKey }
