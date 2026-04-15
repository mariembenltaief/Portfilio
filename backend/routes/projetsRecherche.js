const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projetsRechercheController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Vérifier que protect est une fonction
if (typeof protect !== 'function') {
  console.error('ERREUR: protect n\'est pas une fonction dans projetsRecherche.js');
}

// Routes publiques (GET - sans protection)
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Routes protégées (nécessitent une authentification)
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;