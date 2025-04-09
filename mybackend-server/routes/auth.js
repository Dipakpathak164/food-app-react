const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken'); // make sure this is imported
const secretKey = process.env.JWT_SECRET;
// move this to .env in real projects

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, insertResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering user' });
          }

          const userId = insertResult.insertId;

          db.query('SELECT id, name, email FROM users WHERE id = ?', [userId], (err, userResult) => {
            if (err || userResult.length === 0) {
              console.error(err);
              return res.status(500).json({ message: 'User creation failed' });
            }

            const user = userResult[0];
            const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '7d' });

            return res.status(201).json({
              message: 'Signup successful',
              token,
              user
            });
          });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
});


// === Login ===
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // ✅ Check if credentials match super admin
  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, role: 'superadmin' }, secretKey, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Super Admin Logged In',
      token,
      user: {
        name: 'Super Admin',
        email,
        role: 'superadmin'
      }
    });
  }

  // 🔍 Check regular users
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' }, // ✅ Include role in token
      secretKey,
      { expiresIn: '7d' }
    );

    // ✅ Return only safe fields
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'user' // ✅ Explicitly assign role here
    };

    return res.status(200).json({
      message: 'User logged in successfully',
      token,
      user: safeUser
    });
  });
});


module.exports = router;
