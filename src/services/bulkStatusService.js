import getRedisClient from '../config/redis.js'
async function getBulkStatusKey(userId) {
  return `user:${userId}:bulkstatus`
}
async function setBulkStatus(userId, status) {
  const client = await getRedisClient()
  if (!client) return
  const key = await getBulkStatusKey(userId)
  await client.set(key, JSON.stringify(status))
}
async function getBulkStatus(userId) {
  const client = await getRedisClient()
  if (!client) return null
  const key = await getBulkStatusKey(userId)
  const data = await client.get(key)
  return data ? JSON.parse(data) : null
}
async function getAllBulkStatusKeys() {
  const client = await getRedisClient()
  if (!client) return []
  return client.keys('user:*:bulkstatus')
}
async function getBulkStatusByKey(key) {
  const client = await getRedisClient()
  if (!client) return null
  const data = await client.get(key)
  return data ? JSON.parse(data) : null
}
async function deleteBulkStatusKey(key) {
  const client = await getRedisClient()
  if (!client) return
  await client.del(key)
}
export { setBulkStatus, getBulkStatus, getAllBulkStatusKeys, getBulkStatusByKey, deleteBulkStatusKey }
