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
        const { billingDetails, shippingDetails, paymentMethod, items, totalAmount } = req.body;

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

        // Insert the order into the orders table
        const orderQuery = `
            INSERT INTO orders (
                user_id, email, phone, full_name, country, state, city, zip, address,
                ship_to_different, shipping_full_name, shipping_country, shipping_state, shipping_city, shipping_zip, shipping_address,
                payment_method, card_number, card_expiry, card_cvv, total_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const orderData = [
            req.user.id, billingDetails.email, billingDetails.phone, billingDetails.fullName, billingDetails.country, billingDetails.state,
            billingDetails.city, billingDetails.zip, billingDetails.address, shippingDetails ? true : false, shippingInfo.fullName,
            shippingInfo.country, shippingInfo.state, shippingInfo.city, shippingInfo.zip, shippingInfo.address, paymentMethod,
            paymentMethod === 'card' ? req.body.cardNumber : null, paymentMethod === 'card' ? req.body.cardExpiry : null,
            paymentMethod === 'card' ? req.body.cardCvv : null, totalAmount
        ];

        db.query(orderQuery, orderData, (err, result) => {
            if (err) {
                console.error('❌ Error inserting order:', err);
                return res.status(500).json({ message: 'Failed to place order', error: err });
            }

            console.log('🧾 Order inserted:', result);

            // Check if user already has a primary address in `user_addresses`
            const checkQuery = 'SELECT id, is_primary, address, phone, full_name, city, state, zip, country FROM user_addresses WHERE user_id = ? AND is_primary = TRUE LIMIT 1';
            db.query(checkQuery, [req.user.id], (checkErr, checkResult) => {
                if (checkErr) {
                    console.error('🔍 Error checking primary address:', checkErr);
                    return res.status(500).json({ message: 'Order placed, but failed to check primary address.' });
                }

                // If no primary address exists, insert it
                if (checkResult.length === 0) {
                    const primaryAddressToSet = {
                        address: billingDetails.address,
                        phone: billingDetails.phone,
                        fullName: billingDetails.fullName,
                        city: billingDetails.city,
                        state: billingDetails.state,
                        zip: billingDetails.zip,
                        country: billingDetails.country,
                        is_primary: true
                    };

                    const insertAddressQuery = `
                        INSERT INTO user_addresses (user_id, address, phone, full_name, city, state, zip, country, is_primary)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;

                    db.query(insertAddressQuery, [
                        req.user.id, primaryAddressToSet.address, primaryAddressToSet.phone, primaryAddressToSet.fullName,
                        primaryAddressToSet.city, primaryAddressToSet.state, primaryAddressToSet.zip, primaryAddressToSet.country, primaryAddressToSet.is_primary
                    ], (insertErr, insertResult) => {
                        if (insertErr) {
                            console.error('⚠️ Failed to set primary address:', insertErr);
                            return res.status(500).json({ message: 'Order placed, but failed to set primary address.' });
                        }

                        console.log('🔑 Primary address set.');
                        return res.status(200).json({ message: 'Order placed and primary address set.' });
                    });
                } else {
                    // If there's an existing primary address, check if it's the same
                    const existingAddress = checkResult[0];
                    if (
                        existingAddress.address === billingDetails.address &&
                        existingAddress.phone === billingDetails.phone &&
                        existingAddress.full_name === billingDetails.fullName &&
                        existingAddress.city === billingDetails.city &&
                        existingAddress.state === billingDetails.state &&
                        existingAddress.zip === billingDetails.zip &&
                        existingAddress.country === billingDetails.country
                    ) {
                        console.log('Primary address is the same, no need to update.');
                        return res.status(200).json({ message: 'Order placed successfully, and primary address already exists.' });
                    }

                    // If it's different, update the existing primary address
                    const updateAddressQuery = `
                        UPDATE user_addresses SET address = ?, phone = ?, full_name = ?, city = ?, state = ?, zip = ?, country = ?
                        WHERE id = ?
                    `;
                    db.query(updateAddressQuery, [
                        billingDetails.address, billingDetails.phone, billingDetails.fullName, billingDetails.city,
                        billingDetails.state, billingDetails.zip, billingDetails.country, existingAddress.id
                    ], (updateErr, updateResult) => {
                        if (updateErr) {
                            console.error('⚠️ Failed to update primary address:', updateErr);
                            return res.status(500).json({ message: 'Order placed, but failed to update primary address.' });
                        }

                        console.log('🔑 Primary address updated.');
                        return res.status(200).json({ message: 'Order placed and primary address updated.' });
                    });
                }
            });
        });
    } catch (error) {
        console.error('❌ Order error:', error);
        return res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
});




module.exports = router;
