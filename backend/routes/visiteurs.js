const express = require('express');
const {
  login,
  getMe,
  updateProfile,
  getPublicProfile
} = require('../controllers/visiteursController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

/* 🔐 ADMIN (enseignant) */
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

/* 🌍 PUBLIC (visiteurs page) */
router.get('/public', getPublicProfile);

module.exports = router;