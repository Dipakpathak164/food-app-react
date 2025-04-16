// routes/admin.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../config/db');

// signed Up customers
router.get('/customers', (req, res) => {
  const query = `
    SELECT 
      users.id,
      users.name,
      users.email,
      users.created_at,
      COUNT(orders.id) AS total_orders
    FROM users
    LEFT JOIN orders ON users.id = orders.user_id
    GROUP BY users.id
    ORDER BY users.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json(result);
  });
});


// orders-with-customers
router.get('/orders-with-customers', (req, res) => {
  const query = `
     SELECT 
  orders.id AS order_id,
  orders.created_at AS order_date,
  orders.total_amount,
  orders.phone AS customer_phone,  -- Added phone
  orders.shipping_address AS delivery_address,  -- Added shipping address
  orders.status,  -- Added order status
  users.id AS customer_id,
  users.name AS customer_name,
  users.email AS customer_email,
  users.created_at AS customer_created_at
FROM orders
LEFT JOIN users ON orders.user_id = users.id
ORDER BY orders.created_at DESC
LIMIT 0, 400;
    `;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching orders with customer details:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json(result);
  });
});

// Update order status (for admin)
router.put('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const query = `UPDATE orders SET status = ? WHERE id = ?`;

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating order status:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order status updated successfully' });
  });
});


module.exports = router;
