const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/contact', async (req, res) => {
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
    subject: 'Thanks for contacting us!',
    html: `<p>Dear ${fullName},</p><p>Thank you for reaching out! We will get back to you soon.</p>`,
  };

  try {
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);
    res.json({ message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

module.exports = router;
