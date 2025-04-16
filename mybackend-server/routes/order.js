const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); 
const db = require('../config/db');

// ❌ Don't need this here:
// router.use(express.json()); 
// ✅ Keep express.json() in your main server.js or app.js


// POST /orders - Place a new order
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            billingDetails,
            shippingDetails,
            paymentMethod,
            items,
            totalAmount
        } = req.body;

        // Basic validation
        if (!billingDetails || !items || items.length === 0 || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: 'Invalid order data: Missing required fields.' });
        }

        // Validate each item in the cart
        items.forEach((item, index) => {
            if (!item.productId || !item.quantity || !item.price) {
                return res.status(400).json({ message: `Invalid item data at index ${index}` });
            }
        });

        // Validate card payment details if payment method is 'card'
        if (paymentMethod === 'card') {
            if (!req.body.cardNumber || !req.body.cardExpiry || !req.body.cardCvv) {
                return res.status(400).json({ message: 'Card payment details are missing.' });
            }
        }

        const shippingInfo = shippingDetails && shippingDetails.fullName ? shippingDetails : billingDetails;

        // Database query to insert the order into the orders table
        const orderQuery = `
    INSERT INTO orders (
        user_id, email, phone, full_name, country, state, city, zip, address,
        ship_to_different, shipping_full_name, shipping_country, shipping_state, shipping_city, shipping_zip, shipping_address,
        payment_method, card_number, card_expiry, card_cvv, total_amount
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
    )
`;

const orderData = [
    req.user.id, // 👈 Add this line
    billingDetails.email, billingDetails.phone, billingDetails.fullName, billingDetails.country, billingDetails.state, billingDetails.city, billingDetails.zip, billingDetails.address,
    shippingDetails ? true : false, shippingInfo.fullName, shippingInfo.country, shippingInfo.state, shippingInfo.city, shippingInfo.zip, shippingInfo.address,
    paymentMethod,
    paymentMethod === 'card' ? req.body.cardNumber : null,
    paymentMethod === 'card' ? req.body.cardExpiry : null,
    paymentMethod === 'card' ? req.body.cardCvv : null,
    totalAmount
];
        // Execute the query to insert the order data
        db.query(orderQuery, orderData, (err, result) => {
            if (err) {
                console.error('❌ Error inserting order:', err);  // Log detailed error
                return res.status(500).json({ message: 'Failed to place order', error: err });
            }

            console.log('🧾 Order inserted:', result);
            return res.status(200).json({ message: 'Order placed successfully' });
        });

    } catch (error) {
        console.error('❌ Order error:', error);
        return res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});



module.exports = router;
