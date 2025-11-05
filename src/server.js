import app from './app.js'
import startBulkBooksJob from './jobs/bulkBooksJob.js'
import startReportEmailJob from './jobs/reportEmailJob.js'
const port = process.env.PORT || 4000
app.listen(port, () => {})
startBulkBooksJob()
startReportEmailJob()
