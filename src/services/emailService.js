import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
})
function sendEmail({ to, subject, text, html, attachments }) {
  return transporter.sendMail({ from: process.env.EMAIL_FROM || 'noreply@booksapp.com', to, subject, text, html, attachments })
}
export { sendEmail }
