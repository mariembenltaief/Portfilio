const express = require('express');
const {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication
} = require('../controllers/publicationsController');
const { protect } = require('../middlewares/auth');

const router = express.Router();


router.route('/')
  .get(getPublications)
  .post(protect, createPublication);

router.route('/:id')
  .get(getPublicationById)
  .put(protect, updatePublication)
  .delete(protect, deletePublication);

module.exports = router;
