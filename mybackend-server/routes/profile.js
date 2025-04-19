const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// File storage config for multer
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

  console.log('Adding new address for userId:', userId);

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.log('Error starting transaction:', err);
      return res.status(500).json({ error: 'Transaction start failed.' });
    }

    if (is_primary) {
      // Unset any current primary address before setting the new one
      db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId], (updateErr) => {
        if (updateErr) {
          console.log('Error unsetting current primary address:', updateErr);
          return db.rollback(() => {
            res.status(500).json({ error: 'Error unsetting current primary address' });
          });
        }

        console.log('Unset current primary address');
        insertNewAddress();
      });
    } else {
      insertNewAddress();
    }

    function insertNewAddress() {
      const sql = `
        INSERT INTO user_addresses 
        (user_id, full_name, phone, country, state, city, zip, address, is_primary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          phone = VALUES(phone),
          country = VALUES(country),
          state = VALUES(state),
          city = VALUES(city),
          zip = VALUES(zip),
          address = VALUES(address),
          is_primary = VALUES(is_primary);
      `;
      db.query(sql, [userId, full_name, phone, country, state, city, zip, address, is_primary], (insertErr) => {
        if (insertErr) {
          console.log('Error inserting new address:', insertErr);
          return db.rollback(() => {
            res.status(500).json({ error: 'Error inserting new address' });
          });
        }

        console.log('Address added successfully');
        db.commit((commitErr) => {
          if (commitErr) {
            console.log('Error committing transaction:', commitErr);
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
    if (err || !userResult.length) {
      return res.status(500).json({ error: 'User not found' });
    }

    const user = userResult[0];

    // Fetch primary address from the user_addresses table
    const primaryAddressSql = 'SELECT * FROM user_addresses WHERE user_id = ? AND is_primary = TRUE LIMIT 1';
    db.query(primaryAddressSql, [userId], (err, primaryAddressResult) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching primary address' });
      }

      const primaryAddress = primaryAddressResult.length > 0 ? primaryAddressResult[0] : null;

      db.query(orderCountSql, [userId], (err, countResult) => {
        if (err) {
          return res.status(500).json({ error: 'Error checking orders' });
        }

        const orderCount = countResult[0].orderCount;

        if (orderCount === 0) {
          return res.json({
            ...user,
            showExtraFields: false,
            addresses: [],
            primaryAddress,
          });
        }

        // Fetch all user addresses
        db.query(addressSql, [userId], (err, addressResult) => {
          if (err) {
            return res.status(500).json({ error: 'Error fetching all addresses' });
          }

          return res.json({
            ...user,
            showExtraFields: true,
            addresses: addressResult, // All addresses for the user
            primaryAddress, // Primary address fetched above
          });
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

// Set address as primary endpoint
router.put('/add-address/:id/:addressId/primary', (req, res) => {
    const userId = req.params.id;
    const addressId = req.params.addressId;
  
    console.log(`Setting address ID ${addressId} as primary for user ID ${userId}`);
  
    db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId], (updateErr) => {
      if (updateErr) {
        console.log('Error unsetting current primary address:', updateErr);
        return res.status(500).json({ error: 'Error unsetting current primary address' });
      }
  
      console.log('Unset current primary address');
  
      db.query('UPDATE user_addresses SET is_primary = TRUE WHERE id = ? AND user_id = ?', [addressId, userId], (updateErr2) => {
        if (updateErr2) {
          console.log('Error setting new primary address:', updateErr2);
          return res.status(500).json({ error: 'Error setting primary address' });
        }
  
        console.log(`Address ID ${addressId} set as primary successfully`);
  
        res.json({ message: 'Primary address updated successfully' });
      });
    });
  });
  

// Update user address endpoint
router.put('/update-address/:userId/:addressId', (req, res) => {
    const { userId, addressId } = req.params;
    const { full_name, phone, country, state, city, zip, address, is_primary } = req.body;
  
    if (!full_name || !address) {
      return res.status(400).json({ error: 'Full name and address are required.' });
    }
  
    // Begin transaction to ensure atomicity
    db.beginTransaction((err) => {
      if (err) {
        console.log('Error starting transaction:', err);
        return res.status(500).json({ error: 'Transaction start failed.' });
      }
  
      // If the address is set to primary, ensure it's the only primary address for the user
      if (is_primary) {
        db.query('UPDATE user_addresses SET is_primary = FALSE WHERE user_id = ?', [userId], (updateErr) => {
          if (updateErr) {
            console.log('Error unsetting current primary address:', updateErr);
            return db.rollback(() => res.status(500).json({ error: 'Error unsetting current primary address' }));
          }
  
          console.log('Unset current primary address');
          updateAddress();
        });
      } else {
        updateAddress();
      }
  
      function updateAddress() {
        const sql = `
          UPDATE user_addresses 
          SET full_name = ?, phone = ?, country = ?, state = ?, city = ?, zip = ?, address = ?, is_primary = ?
          WHERE id = ? AND user_id = ?;
        `;
        db.query(sql, [full_name, phone, country, state, city, zip, address, is_primary, addressId, userId], (updateErr) => {
          if (updateErr) {
            console.log('Error updating address:', updateErr);
            return db.rollback(() => res.status(500).json({ error: 'Error updating address' }));
          }
  
          console.log('Address updated successfully');
          db.commit((commitErr) => {
            if (commitErr) {
              console.log('Error committing transaction:', commitErr);
              return db.rollback(() => res.status(500).json({ error: 'Transaction commit failed' }));
            }
  
            res.json({ message: 'Address updated successfully.' });
          });
        });
      }
    });
  });
  
module.exports = router;
