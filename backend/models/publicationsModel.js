const { query } = require('../config/db');

const PublicationsModel = {

  // ================= CREATE =================
  async create(publicationData) {
    const {
      utilisateur_id,
      titre,
      auteurs,
      annee,
      revue,
      resume,
      reference_externe,
      visible
    } = publicationData;

    const result = await query(
      `INSERT INTO publications 
       (utilisateur_id, titre, auteurs, annee, revue, resume, reference_externe, visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [utilisateur_id, titre, auteurs, annee, revue, resume, reference_externe, visible !== false]
    );

    return result.rows[0];
  },

  // ================= USER PUBLICATIONS =================
  async findAllByUser(utilisateur_id, filters = {}) {
    let queryText = 'SELECT * FROM publications WHERE utilisateur_id = $1';
    const params = [utilisateur_id];
    let i = 2;

    if (filters.annee) {
      queryText += ` AND annee = $${i++}`;
      params.push(parseInt(filters.annee));
    }

    if (filters.revue) {
      queryText += ` AND revue ILIKE $${i++}`;
      params.push(`%${filters.revue}%`);
    }

    queryText += ' ORDER BY annee DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  // ================= PUBLIC publications =================
  async findPublic(filters = {}) {
    let queryText = 'SELECT * FROM publications WHERE visible = true';
    const params = [];
    let i = 1;

    if (filters.annee) {
      queryText += ` AND annee = $${i++}`;
      params.push(parseInt(filters.annee));
    }

    if (filters.revue) {
      queryText += ` AND revue ILIKE $${i++}`;
      params.push(`%${filters.revue}%`);
    }

    queryText += ' ORDER BY annee DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  // ================= USER by ID =================
  async findById(id, utilisateur_id) {
    const result = await query(
      'SELECT * FROM publications WHERE id = $1 AND utilisateur_id = $2',
      [id, utilisateur_id]
    );
    return result.rows[0];
  },

  // ================= PUBLIC by ID =================
  async findPublicById(id) {
    const result = await query(
      'SELECT * FROM publications WHERE id = $1 AND visible = true',
      [id]
    );
    return result.rows[0];
  },

  // ================= UPDATE =================
  async update(id, utilisateur_id, updateData) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${i++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id, utilisateur_id);

    const result = await query(
      `UPDATE publications SET ${fields.join(', ')}
       WHERE id = $${i++} AND utilisateur_id = $${i}
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // ================= DELETE =================
  async delete(id, utilisateur_id) {
    const result = await query(
      'DELETE FROM publications WHERE id = $1 AND utilisateur_id = $2 RETURNING id',
      [id, utilisateur_id]
    );
    return result.rowCount > 0; // نرجع boolean بدل object
  }

};

module.exports = PublicationsModel;