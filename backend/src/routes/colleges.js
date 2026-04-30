// FILE: backend/src/routes/colleges.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getColleges,
  getCollegeById,
  getLocations,
  predictColleges
} = require('../controllers/collegeController');

const router = express.Router();

const predictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Too many requests, try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/', getColleges);
router.get('/locations', getLocations);
router.get('/:id', getCollegeById);
router.post('/predict', predictLimiter, predictColleges);

module.exports = router;
