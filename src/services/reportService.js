import PDFDocument from 'pdfkit'
import { Readable } from 'stream'
function generateReportBuffer({ userId, successCount, failureCount, processedAt }) {
  const doc = new PDFDocument()
  const buffers = []
  doc.fontSize(18).text('Bulk Insertion Report', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12).text(`User ID: ${userId}`)
  doc.text(`Success Count: ${successCount}`)
  doc.text(`Failure Count: ${failureCount}`)
  doc.text(`Processed At: ${new Date(processedAt).toLocaleString()}`)
  doc.end()
  return new Promise((resolve, reject) => {
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)
  })
}
export { generateReportBuffer }
