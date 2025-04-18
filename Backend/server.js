const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const paperRoutes = require('./routes/papers');
const statsRoutes = require('./routes/statsRoutes');
const specialSessionRoutes = require('./routes/specialSessions');
const notificationRoutes = require('./routes/notificationRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS with specific options
app.use(cors(config.cors));

// Connect to MongoDB with updated options
mongoose.connect(config.mongodb.uri, config.mongodb.options)
  .then(() => {
    console.log(`Connected to MongoDB (${config.env} environment)`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/special-sessions', specialSessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email', emailRoutes);

// Health check route with enhanced information
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: config.env,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.path
  });
});

// Error handling middleware with better error responses
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: config.env === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: config.env === 'development' ? err.message : 'Something went wrong!',
    ...(config.env === 'development' && { stack: err.stack })
  });
});

if (config.env === 'development') {
  console.log('Email configuration:', {
    user: config.email.user,
    configured: Boolean(config.email.user && config.email.pass)
  });
}

// Start server
const PORT = config.port;
let server;

async function startServer() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (${config.env} environment)`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down gracefully...');
  
  try {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
      console.log('HTTP server closed');
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
}

// Handle various shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

startServer(); 