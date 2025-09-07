// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/cart', require('./routes/cart'));

// Basic health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Database connection state
let isConnected = false;

async function initDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// Export for Vercel (serverless)
module.exports = async (req, res) => {
  try {
    await initDB(); // Ensure DB connection before handling request
    return app(req, res);
  } catch (err) {
    console.error('DB connection failed:', err);
    return res.status(500).json({ message: 'Database connection error' });
  }
};

// Local development (non-serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    try {
      await initDB();
      console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
      console.error('Failed to connect DB locally:', err);
    }
  });
}
