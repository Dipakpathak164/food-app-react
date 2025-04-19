const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// File storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Add address endpoint
router.post('/add-address/:id', (req, res) => {
  const userId = req.params.id;
  const { full_name, phone, country, state, city, zip, address, is_primary } = req.body;

  if (!full_name || !address) {
    return res.status(400).json({ error: 'Full name and address are required.' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction start failed.' });
    }

    // If the address should be primary, unset the current primary address
    if (is_primary) {
      db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId], (updateErr) => {
        if (updateErr) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error unsetting current primary address' });
          });
        }

        // Now insert the new address
        insertNewAddress();
      });
    } else {
      // If it's not primary, just insert the new address
      insertNewAddress();
    }

    // Function to insert the new address
    function insertNewAddress() {
      const sql = `
        INSERT INTO user_addresses 
        (user_id, country, state, city, zip, address, is_primary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [userId, full_name, phone, country, state, city, zip, address, is_primary], (insertErr) => {
        if (insertErr) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error inserting new address' });
          });
        }

        // Commit the transaction if both operations succeed
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Transaction commit failed' });
            });
          }

          res.json({ message: 'Address added successfully.' });
        });
      });
    }
  });
});

// Get user profile endpoint
router.get('/:id', (req, res) => {
    const userId = req.params.id;
  
    const userSql = 'SELECT * FROM users WHERE id = ?';
    const orderCountSql = 'SELECT COUNT(*) as orderCount FROM orders WHERE user_id = ?';
    const addressSql = 'SELECT * FROM user_addresses WHERE user_id = ?';
  
    db.query(userSql, [userId], (err, userResult) => {
      if (err || !userResult.length) return res.status(500).json({ error: 'User not found' });
  
      const user = userResult[0];
      const primaryAddress = user.primary_address; // Get directly from users table
  
      db.query(orderCountSql, [userId], (err, countResult) => {
        if (err) return res.status(500).json({ error: 'Error checking orders' });
  
        const orderCount = countResult[0].orderCount;
  
        if (orderCount === 0) {
          return res.json({ ...user, showExtraFields: false, addresses: [], primaryAddress });
        }
  
        db.query(addressSql, [userId], (err, addressResult) => {
          if (err) return res.status(500).json({ error: 'Error fetching addresses' });
  
          return res.json({
            ...user,
            showExtraFields: true,
            addresses: addressResult,
            primaryAddress, // Pulled from `users` table
          });
        });
      });
    });
  });

  
// Update user profile (name, address, profile image)
router.post('/update/:id', upload.single('profileImage'), (req, res) => {
  const { id } = req.params;
  const { name, address, primaryAddressId } = req.body;  // Added primaryAddressId to update specific address
  const profileImage = req.file ? req.file.filename : null;

  let query = 'UPDATE users SET name = ?';
  const values = [name];

  if (profileImage) {
    query += ', profile_image = ?';
    values.push(profileImage);
  }

  query += ' WHERE id = ?';
  values.push(id);

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    // If primary address is being updated, update it in the user_addresses table
    if (primaryAddressId && address) {
      const updateAddressQuery = 'UPDATE user_addresses SET address = ? WHERE id = ? AND user_id = ?';
      db.query(updateAddressQuery, [address, primaryAddressId, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error updating address' });

        res.json({ message: 'Profile and address updated successfully.' });
      });
    } else {
      res.json({ message: 'Profile updated successfully.' });
    }
  });
});

module.exports = router;
