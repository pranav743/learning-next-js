import cron from 'node-cron'
import { getAllBulkBooksKeys, getBulkBooksByKey, deleteBulkBooksKey } from '../services/redisService.js'
import { addBooksBulk } from '../services/bookService.js'
async function processBulkBooks() {
  const keys = await getAllBulkBooksKeys()
  for (const key of keys) {
    const userId = key.split(':')[1]
    const books = await getBulkBooksByKey(key)
    if (Array.isArray(books) && books.length > 0) {
      try {
        await addBooksBulk(userId, books)
        await deleteBulkBooksKey(key)
      } catch {}
    } else {
      await deleteBulkBooksKey(key)
    }
  }
}
function startBulkBooksJob() {
  cron.schedule('*/2 * * * *', () => {
    processBulkBooks()
  }, { scheduled: true })
}
export default startBulkBooksJob
