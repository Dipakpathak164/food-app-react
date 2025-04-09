const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// ❌ Don't need this here:
// router.use(express.json()); 
// ✅ Keep express.json() in your main server.js or app.js

router.post('/', async (req, res) => {
    const { user, shipping, cart, totalAmount, paymentMethod } = req.body;
    const shipToDifferent = JSON.stringify(user) !== JSON.stringify(shipping);

    try {
        // Insert into orders
        const [orderResult] = await db.execute(`
            INSERT INTO orders (
                billing_email, billing_phone, billing_full_name, billing_country, billing_state, billing_city, billing_zip, billing_address,
                shipping_full_name, shipping_country, shipping_state, shipping_city, shipping_zip, shipping_address,
                ship_to_different, payment_method, total_amount
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            user.email, user.phone, user.fullName, user.country, user.state, user.city, user.zip, user.address,
            shipping.fullName, shipping.country, shipping.state, shipping.city, shipping.zip, shipping.address,
            shipToDifferent, paymentMethod, totalAmount
        ]);

        const orderId = orderResult.insertId;

        // Insert items
        const itemInsertPromises = cart.map(item => {
            return db.execute(`
                INSERT INTO order_items (order_id, item_name, item_price, item_quantity)
                VALUES (?, ?, ?, ?)
            `, [orderId, item.name, item.price, item.quantity]);
        });

        await Promise.all(itemInsertPromises);

        res.status(200).json({ message: 'Order placed!', token: 'authtoken' }); // optional token
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

module.exports = router;
