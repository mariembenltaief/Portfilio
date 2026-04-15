const { query } = require('../config/db');

const VisiteurModel = {
  // Créer un visiteur
  async create(visiteurData) {
    const { nom, prenom, email, mot_de_passe, etablissement, specialite, grade, bio, photo } = visiteurData;
    const result = await query(
      `INSERT INTO visiteurs (nom, prenom, email, mot_de_passe, etablissement, specialite, grade, bio, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, nom, prenom, email, etablissement, specialite, grade, bio, photo, date_creation`,
      [nom, prenom, email, mot_de_passe, etablissement, specialite, grade, bio, photo]
    );
    return result.rows[0];
  },

  // Trouver par email
  async findByEmail(email) {
    const result = await query('SELECT * FROM visiteurs WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Trouver par ID
  async findById(id) {
    const result = await query(
      'SELECT id, nom, prenom, email, etablissement, specialite, grade, bio, photo, date_creation FROM visiteurs WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  // Mettre à jour
  async update(id, updateData) {
    const { nom, prenom, etablissement, specialite, grade, bio, photo } = updateData;
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
       RETURNING id, nom, prenom, email, etablissement, specialite, grade, bio, photo`,
      [nom, prenom, etablissement, specialite, grade, bio, photo, id]
    );
    return result.rows[0];
  },

  // Supprimer
  async delete(id) {
    const result = await query('DELETE FROM visiteurs WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
};

module.exports = VisiteurModel;