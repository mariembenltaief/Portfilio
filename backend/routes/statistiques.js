const express = require('express');
const {
  getStatistics,
  refreshStatistics
} = require('../controllers/statistiquesController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Vérifier que protect est une fonction
if (typeof protect !== 'function') {
  console.error('ERREUR: protect n\'est pas une fonction dans statistiques.js');
}

// Route publique (GET - sans protection)
router.get('/', getStatistics);

// Route protégée (nécessite authentification)
router.post('/refresh', protect, refreshStatistics);

module.exports = router;