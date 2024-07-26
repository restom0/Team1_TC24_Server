import { MAIL_CONFIG } from '../configs/mail.config.js'
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  port: 465,
  host: MAIL_CONFIG.SMTP_HOST,
  auth: {
    user: MAIL_CONFIG.GOOGLE_GMAIL,
    pass: MAIL_CONFIG.GOOGLE_KEY
  },
  secure: true
})
const sendMail = ({ to, subject, html }) => {
  const mailData = {
    from: 'Mindx Restaurant',
    to,
    subject,
    html
  }
  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      return err
    } else {
      return info.messageId
    }
  })
}
export const MailService = { sendMail }
