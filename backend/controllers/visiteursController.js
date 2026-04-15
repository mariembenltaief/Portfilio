const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

/* =========================
   🔐 LOGIN (enseignant only)
========================= */
const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Champs requis" });
    }

    const result = await query(
      'SELECT * FROM visiteurs WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.mot_de_passe;

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   👨‍🏫 GET PROFILE (admin)
========================= */
const getMe = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, nom, prenom, email, etablissement, specialite, grade, bio, photo
       FROM visiteurs
       WHERE id = $1`,
      [req.userId]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   ✏️ UPDATE PROFILE (admin)
========================= */
const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, etablissement, specialite, grade, bio, photo } = req.body;

    const result = await query(
      `UPDATE visiteurs
       SET nom = COALESCE($1, nom),
           prenom = COALESCE($2, prenom),
           etablissement = COALESCE($3, etablissement),
           specialite = COALESCE($4, specialite),
           grade = COALESCE($5, grade),
           bio = COALESCE($6, bio),
           photo = COALESCE($7, photo)
       WHERE id = $8
       RETURNING id, nom, prenom, email, grade, bio, photo`,
      [nom, prenom, etablissement, specialite, grade, bio, photo, req.userId]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   🌍 PUBLIC PROFILE (visitors page)
========================= */
const getPublicProfile = async (req, res) => {
  try {
    const result = await query(`
      SELECT id, nom, prenom, email, etablissement, specialite, grade, bio, photo, date_creation
      FROM visiteurs
      LIMIT 1
    `);

    // Vérifier si un enseignant existe
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Aucun enseignant trouvé" 
      });
    }

    res.json({
      success: true,
      enseignant: result.rows[0]
    });

  } catch (err) {
    console.error("Erreur getPublicProfile:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  getMe,
  updateProfile,
  getPublicProfile
};