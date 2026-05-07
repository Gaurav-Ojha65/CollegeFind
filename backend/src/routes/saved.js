const express = require('express');
const { getSavedColleges, saveCollege, removeSavedCollege } = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getSavedColleges);

router.route('/:collegeId')
  .post(protect, saveCollege)
  .delete(protect, removeSavedCollege);

module.exports = router;
