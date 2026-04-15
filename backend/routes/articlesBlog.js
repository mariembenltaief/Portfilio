const express = require('express');
const {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  getRecentPosts,
  getPostsByYear,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/articlesBlogController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Vérifier que protect est une fonction
if (typeof protect !== 'function') {
  console.error('ERREUR: protect n\'est pas une fonction dans articlesBlog.js');
}

// Routes publiques (GET - sans protection)
router.get('/', getBlogPosts);
router.get('/recent', getRecentPosts);
router.get('/years', getPostsByYear);
router.get('/:id', getBlogPostById);

// Routes protégées (nécessitent une authentification)
router.post('/', protect, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;