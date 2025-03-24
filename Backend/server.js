const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const paperRoutes = require('./routes/papers');
const statsRoutes = require('./routes/statsRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors));

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

app.use('/api/stats', statsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

console.log('Sending email using:', process.env.MAIL_USER);


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 