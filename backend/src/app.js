// FILE: backend/src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const collegesRouter = require('./routes/colleges');
const authRouter = require('./routes/auth');
const savedRouter = require('./routes/saved');
const pool = require('./config/db');

// Middleware
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    // Allow any localhost / 127.0.0.1 port or configured FRONTEND_URL or Vercel URLs
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.includes('vercel.app') ||
      origin === process.env.FRONTEND_URL
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

const path = require('path');

// Routes
app.use('/api/colleges', collegesRouter);
app.use('/api/auth', authRouter);
app.use('/api/saved', savedRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API Route not found' });
});

// Catch-all route to serve React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CollegeFind Server running on ${PORT}`);
});

module.exports = app;