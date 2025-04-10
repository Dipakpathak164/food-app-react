const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Token authentication middleware
const authenticateToken = (req, res, next) => {
    console.log('Token Check:', req.header('Authorization'));  // Debug log to check if the token is present

    // Extract token from Authorization header
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        // Token not provided, send error
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Verify the token using JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Token verification failed, send error
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        
        // Token valid, attach decoded user info to request
        req.user = user;
        next();  // Proceed to next middleware or route handler
    });
};

module.exports = authenticateToken;
