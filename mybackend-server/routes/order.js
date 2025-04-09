// routes/order.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');// adjust path as per your DB connection


router.post('/place-order', async (req, res) => {
  try {
    const { user, shipping, cart, totalAmount, paymentMethod } = req.body;

    // Basic validation
    if (!user?.email || !cart?.length || !totalAmount) {
      return res.status(400).json({ message: 'Incomplete order details' });
    }

    const orderDetails = {
      shipping,
      cart,
    };

    db.query(
      'INSERT INTO orders (user_email, details, total_amount, payment_method) VALUES (?, ?, ?, ?)',
      [user.email, JSON.stringify(orderDetails), totalAmount, paymentMethod],
      (err, result) => {
        if (err) {
          console.error('DB insert error:', err);
          return res.status(500).json({ message: 'Order could not be placed' });
        }

        // Create a token for guest user or future reference
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'fallback_secret', {
          expiresIn: '7d',
        });

        return res.status(200).json({ message: 'Order placed successfully', token });
      }
    );
  } catch (error) {
    console.error('Order placement error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
