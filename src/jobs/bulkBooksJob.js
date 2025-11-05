
import cron from 'node-cron'
import { getAllBulkBooksKeys, getBulkBooksByKey, deleteBulkBooksKey } from '../services/redisService.js'
import { addBooksBulk } from '../services/bookService.js'
import { setBulkStatus } from '../services/bulkStatusService.js'

import { logJobEvent } from '../utils/logger.js'

async function processBulkBooks() {
  const keys = await getAllBulkBooksKeys()
  for (const key of keys) {
    const userId = key.split(':')[1]
    const books = await getBulkBooksByKey(key)
    let successCount = 0
    let failureCount = 0
    if (Array.isArray(books) && books.length > 0) {
      try {
        const result = await addBooksBulk(userId, books)
        successCount = Array.isArray(result) ? result.length : books.length
        await setBulkStatus(userId, {
          userId,
          successCount,
          failureCount,
          processedAt: Date.now()
        })
        await deleteBulkBooksKey(key)
        logJobEvent('bulkBooksJob', `Bulk insert for user ${userId}: ${successCount} success, ${failureCount} failure`)
      } catch (e) {
        failureCount = books.length
        await setBulkStatus(userId, {
          userId,
          successCount,
          failureCount,
          processedAt: Date.now()
        })
        logJobEvent('bulkBooksJob', `Bulk insert failed for user ${userId}: ${failureCount} failure`)
        await deleteBulkBooksKey(key)
      }
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
