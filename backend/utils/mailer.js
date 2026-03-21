const nodemailer = require('nodemailer');

// Configure a test transporter or a real one passing environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

/**
 * Send an email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
const sendEmail = async (to, subject, html) => {
  try {
    // For demo purposes, if SMTP isn't configured, we just log it.
    if (!process.env.SMTP_USER) {
      console.log(`[SIMULATED EMAIL to ${to}] Subject: ${subject}`);
      return true;
    }
    
    const info = await transporter.sendMail({
      from: `"Lumber Timber" <${process.env.SMTP_FROM || 'noreply@lumbertimber.com'}>`,
      to,
      subject,
      html
    });
    
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendEmail
};
