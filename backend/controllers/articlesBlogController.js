const ArticlesBlogModel = require('../models/articlesBlogModel');
const StatistiquesModel = require('../models/statistiquesModel');

// Créer un article de blog (protégé)
const createBlogPost = async (req, res) => {
  try {
    const postData = { ...req.body, utilisateur_id: req.userId };
    const post = await ArticlesBlogModel.create(postData);
    
    // Mettre à jour les statistiques
    const allPosts = await ArticlesBlogModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'blogs', allPosts.length);
    
    res.status(201).json({
      success: true,
      blogPost: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir tous les articles (public)
const getBlogPosts = async (req, res) => {
  try {
    const { langue, annee, categorie, visible } = req.query;
    
    // Si l'utilisateur n'est pas connecté, on ne montre que les articles visibles
    const filters = { langue, annee, categorie };
    if (!req.userId) {
      filters.visible = true;
    } else if (visible !== undefined) {
      filters.visible = visible;
    }
    
    const posts = await ArticlesBlogModel.findAll(null, filters);
    
    res.json({
      success: true,
      blogPosts: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir un article par ID (public)
const getBlogPostById = async (req, res) => {
  try {
    // Si l'utilisateur n'est pas connecté, on cherche seulement les articles visibles
    const post = req.userId 
      ? await ArticlesBlogModel.findById(req.params.id, req.userId)
      : await ArticlesBlogModel.findPublicById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }
    
    res.json({
      success: true,
      blogPost: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir les articles récents (public)
const getRecentPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    // Pour le public, on ne montre que les articles visibles
    const posts = await ArticlesBlogModel.findRecent(null, limit);
    
    res.json({
      success: true,
      recentPosts: posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir les années avec articles (public)
const getPostsByYear = async (req, res) => {
  try {
    // Pour le public, on ne compte que les articles visibles
    const years = req.userId 
      ? await ArticlesBlogModel.getYearsWithPosts(req.userId)
      : await ArticlesBlogModel.getYearsWithPublicPosts();
    
    res.json({
      success: true,
      years
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour un article (protégé)
const updateBlogPost = async (req, res) => {
  try {
    const post = await ArticlesBlogModel.update(req.params.id, req.userId, req.body);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }
    
    res.json({
      success: true,
      blogPost: post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Supprimer un article (protégé)
const deleteBlogPost = async (req, res) => {
  try {
    const result = await ArticlesBlogModel.delete(req.params.id, req.userId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }
    
    // Mettre à jour les statistiques
    const allPosts = await ArticlesBlogModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'blogs', allPosts.length);
    
    res.json({
      success: true,
      message: 'Article supprimé avec succès'
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
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  getRecentPosts,
  getPostsByYear,
  updateBlogPost,
  deleteBlogPost
};