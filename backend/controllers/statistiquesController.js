const StatistiquesModel = require('../models/statistiquesModel');

// Obtenir les statistiques (public)
const getStatistics = async (req, res) => {
  try {
    // Si userId est fourni en paramètre, l'utiliser
    const userId = req.query.userId || req.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId est requis'
      });
    }
    
    let stats = await StatistiquesModel.findByUser(userId);
    
    if (!stats) {
      stats = await StatistiquesModel.createDefault(userId);
    }
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Actualiser les statistiques (protégé)
const refreshStatistics = async (req, res) => {
  try {
    const stats = await StatistiquesModel.refreshAll(req.userId);
    
    res.json({
      success: true,
      statistics: stats
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
  getStatistics,
  refreshStatistics
};