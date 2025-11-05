import cron from 'node-cron'
import { getAllBulkStatusKeys, getBulkStatusByKey, deleteBulkStatusKey } from '../services/bulkStatusService.js'
import { generateReportBuffer } from '../services/reportService.js'
import { sendEmail } from '../services/emailService.js'
import User from '../models/User.js'
import { logJobEvent } from '../utils/logger.js'

async function sendReportWithRetry({ user, status, retries = 3 }) {
  let attempt = 0
  let lastError
  const buffer = await generateReportBuffer(status)
  while (attempt < retries) {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Bulk Insertion Report',
        text: 'See attached PDF report.',
        attachments: [{ filename: 'report.pdf', content: buffer }]
      })
      return true
    } catch (e) {
      lastError = e
      attempt++
    }
  }
  logJobEvent('reportEmailJob', `Failed to send report to user ${user._id}: ${lastError}`)
  return false
}

async function processReportsAndEmails() {
  const keys = await getAllBulkStatusKeys()
  for (const key of keys) {
    const status = await getBulkStatusByKey(key)
    if (!status || !status.userId) {
      await deleteBulkStatusKey(key)
      continue
    }
    const user = await User.findById(status.userId)
    if (!user || !user.email) {
      await deleteBulkStatusKey(key)
      continue
    }
    const sent = await sendReportWithRetry({ user, status })
    if (sent) {
      await deleteBulkStatusKey(key)
      logJobEvent('reportEmailJob', `Report sent to user ${user._id}`)
    }
  }
}

function startReportEmailJob() {
  cron.schedule('*/5 * * * *', () => {
    processReportsAndEmails()
  }, { scheduled: true })
}

export default startReportEmailJob
