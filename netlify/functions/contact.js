const nodemailer = require('nodemailer');

const toEmail = process.env.CONTACT_TO_EMAIL || 'enquiries@zaneandzora.com';

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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed.'
      })
    };
  }

  let payload;

  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Invalid request payload.'
      })
    };
  }

  const { name, email, phone, area, message } = payload;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'Please complete the required fields and try again.'
      })
    };
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
        <p style="white-space: pre-wrap;">${String(message).replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `;

  const transporter = buildTransporter();

  try {
    if (!transporter) {
      console.log('--- Contact form submission (email not configured) ---');
      console.log({ to: toEmail, subject, from: email, name, phone, area, message });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Thank you. Your enquiry has been received. A member of our team will respond shortly.'
        })
      };
    }

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: toEmail,
      replyTo: email,
      subject,
      html
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Thank you. Your enquiry has been received. A member of our team will respond shortly.'
      })
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        message: 'We could not send your message right now. Please email us directly at enquiries@zaneandzora.com.'
      })
    };
  }
};
