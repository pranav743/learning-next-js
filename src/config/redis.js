import { createClient } from 'redis'
let client
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
async function getRedisClient() {
  if (!client) {
    client = createClient({ url: redisUrl })
    client.on('error', () => {})
    try {
      await client.connect()
    } catch (e) {
      client = null
    }
  }
  return client
}
export default getRedisClient
