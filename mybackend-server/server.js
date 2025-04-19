const cors = require('cors'); // <== ✅ Import cors
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foodRoutes'); 
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const contactUs = require('./routes/contact');
const profileRoutes = require('./routes/profile');
const addAddress = require('./routes/addAddress');


require('./initDB'); // 💡 This initializes DB tables & inserts default admin

dotenv.config();

const app = express();

// ✅ Enable CORS for frontend at http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  console.log(`🔍 Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);       // Existing auth routes
app.use('/api/foods', foodRoutes); 
app.use('/api/place-order', orderRoutes);  
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactUs);
app.use('/api/profile', profileRoutes);
app.use('/api/add-address', addAddress);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
