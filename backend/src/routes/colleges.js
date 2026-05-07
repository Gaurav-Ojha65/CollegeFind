// FILE: backend/src/routes/colleges.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getColleges,
  getCollegeById,
  getLocations,
  compareColleges,
  predictColleges,
  getBranches,
  getExamTypes,
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

// Static routes MUST be defined before /:id (dynamic)
router.get('/', getColleges);
router.get('/locations', getLocations);
router.get('/branches', getBranches);
router.get('/exam-types', getExamTypes);
router.post('/compare', compareColleges);
router.post('/predict', predictLimiter, predictColleges);

// Dynamic route — MUST be last
router.get('/:id', getCollegeById);

module.exports = router;
