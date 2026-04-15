const LiensExternesModel = require('../models/liensExternesModel');

// Ajouter un lien (protégé)
const addLink = async (req, res) => {
  try {
    const { type, url } = req.body;
    
    // Valider le type de lien
    const validTypes = ['ORCID', 'Google Scholar', 'GitHub', 'LinkedIn'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type de lien invalide'
      });
    }
    
    const link = await LiensExternesModel.create({
      utilisateur_id: req.userId,
      type,
      url
    });
    
    res.status(201).json({
      success: true,
      link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir tous les liens (public)
const getLinks = async (req, res) => {
  try {
    // Si un userId est fourni dans la requête, on peut filtrer
    const userId = req.query.userId || req.userId;
    
    let links;
    if (userId) {
      // Récupérer les liens d'un utilisateur spécifique
      links = await LiensExternesModel.findAllByUser(userId);
    } else {
      // Récupérer tous les liens publics (si vous voulez tous les liens)
      // Ou retourner un tableau vide
      links = await LiensExternesModel.findAllPublic();
    }
    
    res.json({
      success: true,
      links
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour un lien (protégé)
const updateLink = async (req, res) => {
  try {
    const { url } = req.body;
    
    const link = await LiensExternesModel.update(req.params.id, req.userId, url);
    
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Lien non trouvé'
      });
    }
    
    res.json({
      success: true,
      link
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Supprimer un lien (protégé)
const deleteLink = async (req, res) => {
  try {
    const result = await LiensExternesModel.delete(req.params.id, req.userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Lien non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Lien supprimé avec succès'
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
  addLink,
  getLinks,
  updateLink,
  deleteLink
};