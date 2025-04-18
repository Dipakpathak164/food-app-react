const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const mailOptionsToAdmin = {
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${fullName}`,
    html: `
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  const mailOptionsToUser = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'Thank you for contacting us!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Hi ${fullName},</h2>
        <p>Thank you for reaching out to us. We’ve received your message:</p>
        <blockquote style="margin: 15px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #4CAF50;">
          ${message}
        </blockquote>
        <p>We’ll get back to you shortly.</p>
        <p>Best regards,<br><strong>DPF</strong></p>
        <hr />
        <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);
    res.json({ message: 'Thank you for contacting us! Your message has been sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router;
