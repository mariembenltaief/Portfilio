const express = require('express');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStats
} = require('../controllers/coursController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// PUBLIC
router.get('/', getCourses);

// ⚠️ لازم تحط routes الخاصة قبل dynamic
router.get('/stats', protect, getCourseStats);

// بعده dynamic
router.get('/:id', getCourseById);

// PROTECTED
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;