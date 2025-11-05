import fs from 'fs'
import path from 'path'
const logFile = path.resolve(process.cwd(), 'jobs.log')
function logJobEvent(job, message) {
  const line = `[${new Date().toISOString()}][${job}] ${message}\n`
  fs.appendFile(logFile, line, () => {})
}
export { logJobEvent }
