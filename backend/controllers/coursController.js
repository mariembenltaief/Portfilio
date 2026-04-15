const CoursModel = require('../models/coursModel');
const StatistiquesModel = require('../models/statistiquesModel');

// ================== CREATE ==================
const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      utilisateur_id: req.userId
    };

    const course = await CoursModel.create(courseData);

    const allCourses = await CoursModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'cours', allCourses.length);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ================== GET ALL (PUBLIC) ==================
const getCourses = async (req, res) => {
  try {
    const { type, annee, niveau, institution, visible } = req.query;

    const courses = await CoursModel.findAll({
      type,
      annee,
      niveau,
      institution,
      visible
    });

    res.json({ success: true, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ================== GET BY ID ==================
const getCourseById = async (req, res) => {
  const { id } = req.params;

  

  try {
    const course = await CoursModel.findByIdWithResources(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé"
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

// ================== UPDATE ==================
const updateCourse = async (req, res) => {
  try {
    const course = await CoursModel.update(
      req.params.id,
      req.userId,
      req.body
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    res.json({ success: true, course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ================== DELETE ==================
const deleteCourse = async (req, res) => {
  try {
    const deleted = await CoursModel.delete(
      req.params.id,
      req.userId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    const allCourses = await CoursModel.findAllByUser(req.userId);
    await StatistiquesModel.update(req.userId, 'cours', allCourses.length);

    res.json({
      success: true,
      message: 'Cours supprimé avec succès'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ================== STATS ==================
const getCourseStats = async (req, res) => {
  try {
    const stats = await CoursModel.getStats(req.userId);

    res.json({ success: true, stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStats
};