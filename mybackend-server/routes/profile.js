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

// Get user profile
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    const userSql = 'SELECT * FROM users WHERE id = ?';
    const orderCountSql = 'SELECT COUNT(*) as orderCount FROM orders WHERE user_id = ?';
    const addressSql = 'SELECT * FROM user_addresses WHERE user_id = ?';  // Fetching all addresses
  
    db.query(userSql, [userId], (err, userResult) => {
      if (err || !userResult.length) return res.status(500).json({ error: 'User not found' });
  
      const user = userResult[0];
  
      db.query(orderCountSql, [userId], (err, countResult) => {
        if (err) return res.status(500).json({ error: 'Error checking orders' });
  
        const orderCount = countResult[0].orderCount;
  
        if (orderCount === 0) {
          // If no orders, just return user data without addresses
          return res.json({ ...user, showExtraFields: false, addresses: [] });
        }
  
        // Fetch addresses from `user_addresses` table
        db.query(addressSql, [userId], (err, addressResult) => {
          if (err) return res.status(500).json({ error: 'Error fetching addresses' });
  
          // Assuming primary address is the first one or based on some condition
          const primaryAddress = addressResult[0] ? addressResult[0].address : null;
  
          return res.json({
            ...user,
            showExtraFields: true,
            addresses: addressResult,
            primaryAddress, // Add primary address here
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
