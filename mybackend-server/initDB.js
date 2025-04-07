const db = require('./config/db');

const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(createUsersTable, (err, result) => {
  if (err) {
    console.error('Error creating users table:', err);
  } else {
    console.log('Users table created or already exists.');
  }
});

const createFoodsTable = `
  CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(createFoodsTable, (err, result) => {
  if (err) {
    console.error('Error creating foods table:', err);
  } else {
    console.log('Foods table created or already exists.');
  }
});
