import app from './app.js'
import startBulkBooksJob from './jobs/bulkBooksJob.js'
const port = process.env.PORT || 4000
app.listen(port, () => {})
startBulkBooksJob()
