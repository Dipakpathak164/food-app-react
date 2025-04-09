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

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    billing_email VARCHAR(100),
    billing_phone VARCHAR(20),
    billing_full_name VARCHAR(100),
    billing_country VARCHAR(100),
    billing_state VARCHAR(100),
    billing_city VARCHAR(100),
    billing_zip VARCHAR(20),
    billing_address TEXT,

    shipping_full_name VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_city VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_address TEXT,

    ship_to_different BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(20),
    total_amount DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createOrdersTable, (err, result) => {
    if (err) throw err;
    console.log('Orders table created or already exists');
});

const createOrderItemsTable = `
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_name VARCHAR(255),
    item_price DECIMAL(10,2),
    item_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)`;

db.query(createOrderItemsTable, (err, result) => {
    if (err) throw err;
    console.log('Order Items table created or already exists');
});
