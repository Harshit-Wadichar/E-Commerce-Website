// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // parse application/json

// Routes (can be registered before DB connect; handlers will run once server is up)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/cart', require('./routes/cart'));

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Serve frontend in production (assumes frontend build placed in ../frontend/dist)
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(staticPath));

  // Serve index.html for any other routes (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// Global error handler (last middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

let server = null;

// Start the server after DB connection succeeds
(async () => {
  try {
    // connectDB will read MONGODB_URI / MONGO_URI and dbName from env if needed
    await connectDB(); 
    const PORT = Number(process.env.PORT) || 5000;
    server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('Failed to start application due to DB connection error:', err);
    process.exit(1);
  }
})();

// Graceful shutdown
const shutDown = () => {
  console.log('Received kill signal, shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('Closed out remaining connections.');
      try {
        if (mongoose.connection.readyState) {
          await mongoose.connection.close(false);
          console.log('MongoDB connection closed.');
        }
      } catch (e) {
        console.error('Error closing MongoDB connection:', e);
      } finally {
        process.exit(0);
      }
    });
  } else {
    process.exit(0);
  }

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
