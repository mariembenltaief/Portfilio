// routes/ressourcesCours.js
// FIX: GET /course/:courseId uses softProtect (public access allowed).
//      All write operations stay behind hard protect.

const express = require('express');
const {
  uploadResource,
  getResourcesByCourse,
  downloadResource,
  deleteResource,
  updateResourceVisibility,
} = require('../controllers/ressourcesCoursController');
const { protect, softProtect } = require('../middlewares/auth');

const router = express.Router();
const upload = require('../middlewares/upload');

// ── PUBLIC (with optional auth) ───────────────────────────────
// softProtect: sets req.userId if token present, never blocks
router.get('/course/:courseId', getResourcesByCourse);
router.get('/:id/preview', downloadResource);

// ── PROTECTED (hard auth required) ───────────────────────────
router.post(
  '/course/:courseId/upload',
  protect,
  upload.single('fichier'), // ⚠️ نفس الاسم لازم "fichier"
  uploadResource
);
router.get('/:id/download', downloadResource);
router.put   ('/:id/visibility',          protect, updateResourceVisibility);
router.delete('/:id',                     protect, deleteResource);

module.exports = router;