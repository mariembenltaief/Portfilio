const PublicationsModel = require('../models/publicationsModel');
const StatistiquesModel = require('../models/statistiquesModel');
const { query } = require('../config/db');

// ✅ Créer
const createPublication = async (req, res) => {
  try {
    const publicationData = { ...req.body, utilisateur_id: req.userId };
    const publication = await PublicationsModel.create(publicationData);
    
    const allPublications = await PublicationsModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'publications', allPublications.length);
    
    res.status(201).json({
      success: true,
      publication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ✅ GET ALL (PUBLIC + USER)
const getPublications = async (req, res) => {
  try {
    const { annee, revue } = req.query;

    let publications;

    if (req.userId) {
      // 🔐 user connecté → publications متاعو
      publications = await PublicationsModel.findAllByUser(req.userId, {
        annee,
        revue
      });
    } else {
      // 🌍 public → visible فقط
      publications = await PublicationsModel.findPublic({
        annee,
        revue
      });
    }

    res.json({
      success: true,
      publications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ✅ GET BY ID
const getPublicationById = async (req, res) => {
  try {
    let publication;

    if (req.userId) {
      publication = await PublicationsModel.findById(req.params.id, req.userId);
    } else {
      publication = await PublicationsModel.findPublicById(req.params.id);
    }

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication non trouvée'
      });
    }

    res.json({
      success: true,
      publication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ✅ UPDATE
const updatePublication = async (req, res) => {
  try {
    const publication = await PublicationsModel.update(req.params.id, req.userId, req.body);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication non trouvée'
      });
    }

    res.json({
      success: true,
      publication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// ✅ DELETE
const deletePublication = async (req, res) => {
  try {
    const result = await PublicationsModel.delete(req.params.id, req.userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Publication non trouvée'
      });
    }

    const allPublications = await PublicationsModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'publications', allPublications.length);

    res.json({
      success: true,
      message: 'Publication supprimée avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication
};