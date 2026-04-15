const express = require('express');
const {
  getPublicParameters,
  getUserParameters,
  updateUserParameters
} = require('../controllers/parametresController');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// 🔓 Public
router.get('/public', getPublicParameters);

// 🔒 Private
router.use(protect);

router.route('/')
  .get(getUserParameters)
  .put(updateUserParameters);

module.exports = router;