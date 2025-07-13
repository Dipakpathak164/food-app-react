const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foodRoutes'); 
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const contactUs = require('./routes/contact');
const profileRoutes = require('./routes/profile');

require('./initDB'); // Initializes DB tables & inserts default admin

dotenv.config();

const app = express();

// ✅ Allow requests from both localhost and LAN IP (update IP as needed)
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.1.4:5173', // Replace with your host machine's IP
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Request logger
app.use((req, res, next) => {
  console.log(`🔍 Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes); 
app.use('/api/place-order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactUs);
app.use('/api/profile', profileRoutes);

// ✅ Start server on all interfaces (LAN-accessible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT} (LAN accessible)`);
});
