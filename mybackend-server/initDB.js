const db = require('./config/db');

const createUsersTable = `
 CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  profile_image VARCHAR(255),
  address TEXT,
  primary_address TEXT,  -- Added this column to store the primary address
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

const createOrdersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100),
    city VARCHAR(100),
    zip VARCHAR(20),
    address TEXT,
    ship_to_different BOOLEAN DEFAULT FALSE,
    shipping_full_name VARCHAR(255),
    shipping_country VARCHAR(100) DEFAULT 'India',
    shipping_state VARCHAR(100),
    shipping_city VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_address TEXT,
    payment_method ENUM('cod', 'card') DEFAULT 'cod',
    card_number VARCHAR(20),
    card_expiry VARCHAR(7),
    card_cvv VARCHAR(4),
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`;


db.query(createOrdersTable, (err, result) => {
  if (err) {
    console.error('Error creating orders table:', err);
  } else {
    console.log('Orders table created or already exists.');
  }
});

const createUserAddressesTable = `
  CREATE TABLE IF NOT EXISTS user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100),
    city VARCHAR(100),
    zip VARCHAR(20),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

db.query(createUserAddressesTable, (err, result) => {
  if (err) {
    console.error('Error creating user_addresses table:', err);
  } else {
    console.log('User Addresses table created or already exists.');
  }
});

