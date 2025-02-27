
const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
const allowedOrigins = ['http://localhost:5173']; // Allow requests from this frontend URL

const options = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow credentials (cookies, tokens, etc.)
};

app.use(cors(options));
app.use(express.json());

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to mongoDB.');
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

// Route Files
const authRoutes = require('./src/routes/authRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const emergencyContactRoutes = require('./src/routes/emergencyContactRoutes.js');
const serviceHistoryRoutes = require('./src/routes/serviceHistoryRoutes.js');
const adminRoutes = require('./src/routes/adminRoutes.js');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/service-history', serviceHistoryRoutes);
app.use('/api/admin', adminRoutes);

// Server
app.listen(8000, () => {
  connect();
  console.log('Backend is running on http://localhost:8000');
});
