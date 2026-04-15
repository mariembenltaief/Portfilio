const ProjetsRechercheModel = require('../models/projetsRechercheModel');
const StatistiquesModel = require('../models/statistiquesModel');

// Créer un projet (protégé)
const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body, utilisateur_id: req.userId };
    const project = await ProjetsRechercheModel.create(projectData);
    
    // Mettre à jour les statistiques
    const allProjects = await ProjetsRechercheModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'projets', allProjects.length);
    
    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir tous les projets (public)
const getProjects = async (req, res) => {
  try {
    const { axe_recherche, visible, userId } = req.query;
    
    let projects;
    
    // Si un userId est spécifié dans la requête
    if (userId) {
      // Pour le public, on ne montre que les projets visibles
      projects = await ProjetsRechercheModel.findAllByUser(userId, {
        axe_recherche,
        visible: true  // Force visible=true pour le public
      });
    } 
    // Si l'utilisateur est connecté et demande ses propres projets
    else if (req.userId) {
      projects = await ProjetsRechercheModel.findAllByUser(req.userId, {
        axe_recherche,
        visible
      });
    }
    // Public sans userId spécifié - retourner tous les projets visibles de tous les utilisateurs
    else {
      projects = await ProjetsRechercheModel.findAllPublic({
        axe_recherche
      });
    }
    
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir un projet par ID (public)
const getProjectById = async (req, res) => {
  try {
    let project;
    
    // Si l'utilisateur est connecté, il peut voir ses propres projets même non visibles
    if (req.userId) {
      project = await ProjetsRechercheModel.findById(req.params.id, req.userId);
    } 
    // Sinon, chercher seulement les projets visibles
    else {
      project = await ProjetsRechercheModel.findPublicById(req.params.id);
    }
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Vérifier si le projet est visible pour le public
    if (!req.userId && project.visible === false) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour un projet (protégé)
const updateProject = async (req, res) => {
  try {
    const project = await ProjetsRechercheModel.update(req.params.id, req.userId, req.body);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Supprimer un projet (protégé)
const deleteProject = async (req, res) => {
  try {
    const result = await ProjetsRechercheModel.delete(req.params.id, req.userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Mettre à jour les statistiques
    const allProjects = await ProjetsRechercheModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'projets', allProjects.length);
    
    res.json({
      success: true,
      message: 'Projet supprimé avec succès'
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
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};