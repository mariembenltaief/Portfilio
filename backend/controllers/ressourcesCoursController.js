// controllers/ressourcesCoursController.js

const path = require('path');
const fs   = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const RessourcesCoursModel = require('../models/ressourcesCoursModel');
const CoursModel           = require('../models/coursModel');
const { pool } = require('../config/db');

// ─── Multer config ────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resources');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg', 'image/png', 'image/jpg',
    'video/mp4',
    'application/zip', 'application/x-zip-compressed',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé (PDF, DOC, DOCX, PPT, JPG, PNG, MP4, ZIP)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter,
}).single('fichier');

// ─── Helper: resolve stored path to absolute ─────────────────
function resolveFilePath(stored) {
  if (!stored) return null;
  // Absolute path → use directly
  if (path.isAbsolute(stored)) return stored;
  // Relative path like 'uploads/resources/file.pdf'
  // __dirname = backend/controllers → go up ONE level to backend root
  return path.join(__dirname, '..', stored);
}

// ════════════════════════════════════════════════════════════════
// UPLOAD RESOURCE
// ════════════════════════════════════════════════════════════════
const uploadResource = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Aucun fichier" });
    }

    const cleanPath = `uploads/resources/${file.filename}`;

    const newResource = await pool.query(
      `INSERT INTO public.ressources_cours (cours_id, titre, fichier)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.params.courseId, file.originalname, cleanPath]
    );

    res.json({ success: true, resource: newResource.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ════════════════════════════════════════════════════════════════
// GET RESOURCES BY COURSE  — PUBLIC
// ════════════════════════════════════════════════════════════════
const getResourcesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await CoursModel.findByIdPublic(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Cours non trouvé" });
    }

    if (!course.visible) {
      return res.json({ success: true, resources: [] });
    }

    const resources = await RessourcesCoursModel.findByCourse(courseId);

    return res.json({ success: true, resources });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// ════════════════════════════════════════════════════════════════
// DOWNLOAD RESOURCE  — PROTECTED
// ════════════════════════════════════════════════════════════════
const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Chercher la ressource sans restriction visible (download public)
    const dbResult = await pool.query(
      `SELECT r.*, c.visible as cours_visible
       FROM ressources_cours r
       JOIN cours c ON r.cours_id = c.id
       WHERE r.id = $1`,
      [id]
    );
    const resource = dbResult.rows[0];
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Ressource non trouvée' });
    }

    const filePath = resolveFilePath(resource.fichier);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Fichier introuvable sur le serveur' });
    }

    const ext = path.extname(filePath).toLowerCase();

    // ─── PREVIEW MODE — uniquement si ?preview=true ───────────────
    if (req.query.preview === 'true') {
      const mimeTypes = {
        '.pdf':  'application/pdf',
        '.jpg':  'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png':  'image/png',
        '.mp4':  'video/mp4',
      };
      const mime = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Disposition', 'inline');
      return res.sendFile(filePath);
    }

    // ─── DOWNLOAD MODE — force téléchargement dans TOUS les cas ────
    // Content-Type: application/octet-stream empêche le navigateur
    // d'afficher le fichier (PDF, image, etc.)
    const downloadName = resource.titre.includes('.')
      ? resource.titre
      : `${resource.titre}${ext}`;

    // ✅ Incrémenter le compteur de téléchargements
    await RessourcesCoursModel.incrementDownloads(id);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`
    );
    return res.sendFile(filePath);

  } catch (err) {
    console.error('downloadResource error:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ════════════════════════════════════════════════════════════════
// DELETE RESOURCE
// ════════════════════════════════════════════════════════════════
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await RessourcesCoursModel.delete(id, req.userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée ou non autorisée'
      });
    }

    const filePath = resolveFilePath(result.fichier);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({ success: true, message: 'Ressource supprimée' });

  } catch (error) {
    console.error('deleteResource error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// ════════════════════════════════════════════════════════════════
// UPDATE VISIBILITY
// ════════════════════════════════════════════════════════════════
const updateResourceVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { visible, afficher_compteur } = req.body;

    const resource = await RessourcesCoursModel.updateVisibility(
      id, req.userId, visible, afficher_compteur
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée ou non autorisée'
      });
    }

    return res.json({ success: true, resource });

  } catch (error) {
    console.error('updateResourceVisibility error:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  uploadResource,
  getResourcesByCourse,
  downloadResource,
  deleteResource,
  updateResourceVisibility,
};