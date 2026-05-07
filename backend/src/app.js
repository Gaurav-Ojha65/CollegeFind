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

// DB connectivity check
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ DB CONNECTED:', res.rows[0]);
  })
  .catch(err => {
    console.error('❌ DB CONNECTION ERROR:', err.message);
  });

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Request logging (lightweight, no dependencies)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/api/colleges', collegesRouter);
app.use('/api/auth', authRouter);
app.use('/api/saved', savedRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
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
  console.log(`Server running on ${PORT}`);
});

module.exports = app;