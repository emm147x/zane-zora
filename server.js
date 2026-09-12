const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const toEmail = process.env.CONTACT_TO_EMAIL || 'enquiries@zaneandzora.com';

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
};

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, area, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please complete the required fields and try again.'
    });
  }

  const subject = `New enquiry from ${name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #171614; line-height: 1.6;">
      <h2 style="margin-bottom: 12px; color: #171614;">New Legal Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Practice area:</strong> ${area || 'General enquiry'}</p>
      <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #d8d2c7;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `;

  const transporter = buildTransporter();

  try {
    if (!transporter) {
      console.log('--- Contact form submission (email not configured) ---');
      console.log({ to: toEmail, subject, from: email, name, phone, area, message });
      return res.json({
        success: true,
        message: 'Thank you. Your enquiry has been received. A member of our team will respond shortly.'
      });
    }

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: toEmail,
      replyTo: email,
      subject,
      html
    });

    return res.json({
      success: true,
      message: 'Thank you. Your enquiry has been received. A member of our team will respond shortly.'
    });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({
      success: false,
      message: 'We could not send your message right now. Please email us directly at enquiries@zaneandzora.com.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Zane & Zora server running on http://localhost:${PORT}`);
  console.log(`Configure SMTP in a .env file to send enquiries by email.`);
});
