const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// === Add New Food ===
router.post('/', upload.single('image'), (req, res) => {
  const { name, price, discountedPrice, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }

  const sql = `
    INSERT INTO foods (name, price, discounted_price, description, image)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, price, discountedPrice || null, description, image], (err, result) => {
    if (err) {
      console.error('❌ Error inserting food:', err);
      return res.status(500).json({ message: 'Failed to add food' });
    }

    res.status(201).json({ message: 'Food added successfully', foodId: result.insertId });
  });
});

// === Get All Foods (Newest First) ===
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM foods ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching foods:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
});

// === Get Single Food By ID ===
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM foods WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching food:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(results[0]);
  });
});

// === Update Food By ID ===
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, price, discountedPrice, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const values = [name, price, discountedPrice || null, description];
  let sql = `UPDATE foods SET name=?, price=?, discounted_price=?, description=?`;

  if (image) {
    sql += `, image=?`;
    values.push(image);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error updating food:', err);
      return res.status(500).json({ message: 'Failed to update food' });
    }

    res.json({ message: 'Food updated successfully' });
  });
});

router.delete('/:id', (req, res) => {
  console.log('DELETE request received for ID:', req.params.id); // ✅

  const { id } = req.params;
  const sql = 'DELETE FROM foods WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting food:', err);
      return res.status(500).json({ message: 'Failed to delete food' });
    }

    console.log('Deleted successfully:', result);
    res.json({ message: '🗑️ Food deleted successfully' });
  });
});


module.exports = router;
