// controllers/aproposController.js
const SkillModel = require("../models/SkillModel");
const ParcoursModel = require("../models/ParcoursModel");

// Initialisation des modèles
let skillModel = null;
let parcoursModel = null;

const initModels = (pool) => {
  skillModel = new SkillModel(pool);
  parcoursModel = new ParcoursModel(pool);
};

// ── SKILLS ───────────────────────────────────────────────────
const getPublicSkills = async (req, res) => {
  try {
    const skills = await skillModel.getPublic();
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error('Erreur getPublicSkills:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const getMySkills = async (req, res) => {
  try {
    // CHANGEMENT: utiliser req.userId au lieu de req.user.id
    const userId = req.userId; // ou req.user.id selon votre middleware
    const skills = await skillModel.getByVisiteur(userId);
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error('Erreur getMySkills:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const createSkill = async (req, res) => {
  const { label, icon, pct, ordre } = req.body;
  
  if (!label || !label.trim()) {
    return res.status(400).json({ success: false, message: "Le label est requis" });
  }
  if (pct === undefined || pct === null) {
    return res.status(400).json({ success: false, message: "Le pourcentage est requis" });
  }
  if (pct < 0 || pct > 100) {
    return res.status(400).json({ success: false, message: "Le pourcentage doit être entre 0 et 100" });
  }
  
  try {
    // CHANGEMENT: utiliser req.userId
    const skill = await skillModel.create(req.userId, { label, icon, pct, ordre });
    res.status(201).json({ success: true, skill });
  } catch (error) {
    console.error('Erreur createSkill:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { label, icon, pct, ordre } = req.body;
  
  if (pct !== undefined && (pct < 0 || pct > 100)) {
    return res.status(400).json({ success: false, message: "Le pourcentage doit être entre 0 et 100" });
  }
  
  try {
    // CHANGEMENT: utiliser req.userId
    const skill = await skillModel.update(id, req.userId, { label, icon, pct, ordre });
    if (!skill) {
      return res.status(404).json({ success: false, message: "Compétence non trouvée" });
    }
    res.status(200).json({ success: true, skill });
  } catch (error) {
    console.error('Erreur updateSkill:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    // CHANGEMENT: utiliser req.userId
    const deleted = await skillModel.delete(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Compétence non trouvée" });
    }
    res.status(200).json({ success: true, message: "Compétence supprimée" });
  } catch (error) {
    console.error('Erreur deleteSkill:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const reorderSkills = async (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "La liste des IDs est requise" });
  }
  
  try {
    // CHANGEMENT: utiliser req.userId
    await skillModel.reorder(req.userId, ids);
    res.status(200).json({ success: true, message: "Ordre mis à jour" });
  } catch (error) {
    console.error('Erreur reorderSkills:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ── PARCOURS ─────────────────────────────────────────────────
const getPublicParcours = async (req, res) => {
  try {
    const parcours = await parcoursModel.getPublic();
    res.status(200).json({ success: true, parcours });
  } catch (error) {
    console.error('Erreur getPublicParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const getMyParcours = async (req, res) => {
  try {
    // CHANGEMENT: utiliser req.userId
    const parcours = await parcoursModel.getByVisiteur(req.userId);
    res.status(200).json({ success: true, parcours });
  } catch (error) {
    console.error('Erreur getMyParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const createParcours = async (req, res) => {
  const { period, titre, lieu, ordre } = req.body;
  
  if (!period || !period.trim()) {
    return res.status(400).json({ success: false, message: "La période est requise" });
  }
  if (!titre || !titre.trim()) {
    return res.status(400).json({ success: false, message: "Le titre est requis" });
  }
  
  try {
    // CHANGEMENT: utiliser req.userId
    const parcours = await parcoursModel.create(req.userId, { period, titre, lieu, ordre });
    res.status(201).json({ success: true, parcours });
  } catch (error) {
    console.error('Erreur createParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const updateParcours = async (req, res) => {
  const { id } = req.params;
  const { period, titre, lieu, ordre } = req.body;
  
  try {
    // CHANGEMENT: utiliser req.userId
    const parcours = await parcoursModel.update(id, req.userId, { period, titre, lieu, ordre });
    if (!parcours) {
      return res.status(404).json({ success: false, message: "Parcours non trouvé" });
    }
    res.status(200).json({ success: true, parcours });
  } catch (error) {
    console.error('Erreur updateParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const deleteParcours = async (req, res) => {
  try {
    // CHANGEMENT: utiliser req.userId
    const deleted = await parcoursModel.delete(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Parcours non trouvé" });
    }
    res.status(200).json({ success: true, message: "Parcours supprimé" });
  } catch (error) {
    console.error('Erreur deleteParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

const reorderParcours = async (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "La liste des IDs est requise" });
  }
  
  try {
    // CHANGEMENT: utiliser req.userId
    await parcoursModel.reorder(req.userId, ids);
    res.status(200).json({ success: true, message: "Ordre mis à jour" });
  } catch (error) {
    console.error('Erreur reorderParcours:', error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

module.exports = {
  initModels,
  getPublicSkills,
  getMySkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  getPublicParcours,
  getMyParcours,
  createParcours,
  updateParcours,
  deleteParcours,
  reorderParcours
};