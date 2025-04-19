const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

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
        (user_id, full_name, phone, country, state, city, zip, address, is_primary)
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

module.exports = router;
