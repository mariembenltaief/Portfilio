const express = require('express');
const {
  addLink,
  getLinks,
  updateLink,
  deleteLink
} = require('../controllers/liensExternesController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Vérifier que protect est une fonction
if (typeof protect !== 'function') {
  console.error('ERREUR: protect n\'est pas une fonction dans liensExternes.js');
}

// Routes publiques (GET - sans protection)
router.get('/', getLinks);

// Routes protégées (nécessitent une authentification)
router.post('/', protect, addLink);
router.put('/:id', protect, updateLink);
router.delete('/:id', protect, deleteLink);

module.exports = router;