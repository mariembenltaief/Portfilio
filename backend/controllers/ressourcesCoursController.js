// controllers/ressourcesCoursController.js
// FIXES:
//  ✅ getResourcesByCourse: works without auth (req.userId may be undefined)
//  ✅ downloadResource: consistent path resolution (no more path breaks)
//  ✅ uploadResource: stores relative path 'uploads/resources/filename'
//  ✅ All responses use consistent { success, resources/resource } shape

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
// Handles both legacy absolute paths and new relative paths.
function resolveFilePath(stored) {
  if (!stored) return null;

  // إذا absolute path → نستعمله مباشرة
  if (path.isAbsolute(stored)) {
    return stored;
  }

  // FORCE correct backend uploads folder
  return path.join(__dirname, '..', '..', stored);
}

// ─── Helper: store consistent relative path ──────────────────
function makeStoredPath(filename) {
  // Always store as forward-slash relative path (cross-platform)
  return `uploads/resources/${filename}`;
}

// ════════════════════════════════════════════════════════════════
// UPLOAD RESOURCE
// ════════════════════════════════════════════════════════════════
const uploadResource = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier",
      });
    }

    const cleanPath = `uploads/resources/${file.filename}`;

    const newResource = await pool.query(
      `INSERT INTO public.ressources_cours (cours_id, titre, fichier)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.params.courseId, file.originalname, cleanPath]
    );

    res.json({
      success: true,
      resource: newResource.rows[0], // ⚠️ standardize
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ════════════════════════════════════════════════════════════════
// GET RESOURCES BY COURSE  — PUBLIC (softProtect applied in route)
// ════════════════════════════════════════════════════════════════
const getResourcesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. check course exists (WITHOUT visible blocking)
    const course = await CoursModel.findByIdPublic(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé"
      });
    }

    // 2. if course not visible → no resources
    if (!course.visible) {
      return res.json({ success: true, resources: [] });
    }

    // 3. get resources (PUBLIC ONLY)
    const resources = await RessourcesCoursModel.findByCourse(courseId);

    return res.json({
      success: true,
      resources
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

// ════════════════════════════════════════════════════════════════
// DOWNLOAD RESOURCE  — PROTECTED
// ════════════════════════════════════════════════════════════════
const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await RessourcesCoursModel.findById(id, req.userId);
    if (!resource) {
      return res.status(404).json({ success: false });
    }

    const filePath = resolveFilePath(resource.fichier);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const ext = path.extname(filePath).toLowerCase();

    // 📌 PREVIEW MODE (browser display)
    if (req.query.preview === 'true' || ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      return res.sendFile(filePath);
    }

    // 📌 DOWNLOAD MODE
    return res.download(filePath, resource.titre);

  } catch (err) {
    return res.status(500).json({ success: false });
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

    // 🔥 now result.fichier exists
    const filePath = resolveFilePath(result.fichier);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({
      success: true,
      message: 'Ressource supprimée'
    });

  } catch (error) {
    console.error('deleteResource error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
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
      return res.status(404).json({ success: false, message: 'Ressource non trouvée ou non autorisée' });
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