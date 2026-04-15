const { query } = require('../config/db');

const CoursModel = {

  // ================= CREATE =================
  async create(coursData) {
    const {
      utilisateur_id,
      type,
      institution,
      annee,
      intitule,
      niveau,
      description,
      volume_horaire,
      intervenants,
      evaluation,
      visible
    } = coursData;

    const result = await query(
      `INSERT INTO cours
       (utilisateur_id, type, institution, annee, intitule, niveau,
        description, volume_horaire, intervenants, evaluation, visible)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        utilisateur_id,
        type,
        institution,
        annee,
        intitule,
        niveau,
        description,
        volume_horaire,
        intervenants,
        evaluation,
        visible !== false
      ]
    );

    return result.rows[0];
  },

  // ================= GET ALL (PUBLIC) =================
  async findAll(filters = {}) {
    let queryText = 'SELECT * FROM cours WHERE 1=1';
    const params = [];
    let i = 1;

    if (filters.type) {
      queryText += ` AND type = $${i++}`;
      params.push(filters.type);
    }

    if (filters.annee) {
      queryText += ` AND annee = $${i++}`;
      params.push(filters.annee);
    }

    if (filters.niveau) {
      queryText += ` AND niveau = $${i++}`;
      params.push(filters.niveau);
    }

    if (filters.institution) {
      queryText += ` AND institution = $${i++}`;
      params.push(filters.institution);
    }

    if (filters.visible !== undefined) {
      queryText += ` AND visible = $${i++}`;
      params.push(filters.visible === 'true' || filters.visible === true);
    }

    queryText += ' ORDER BY annee DESC, date_creation DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  // ================= GET ALL BY USER =================
  async findAllByUser(utilisateur_id, filters = {}) {
    let queryText = 'SELECT * FROM cours WHERE utilisateur_id = $1';
    const params = [utilisateur_id];
    let i = 2;

    if (filters.type) {
      queryText += ` AND type = $${i++}`;
      params.push(filters.type);
    }

    if (filters.annee) {
      queryText += ` AND annee = $${i++}`;
      params.push(filters.annee);
    }

    if (filters.niveau) {
      queryText += ` AND niveau = $${i++}`;
      params.push(filters.niveau);
    }

    if (filters.institution) {
      queryText += ` AND institution = $${i++}`;
      params.push(filters.institution);
    }

    if (filters.visible !== undefined) {
      queryText += ` AND visible = $${i++}`;
      params.push(filters.visible === 'true' || filters.visible === true);
    }

    queryText += ' ORDER BY annee DESC, date_creation DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  // ================= GET BY ID =================
  async findById(id) {
  const result = await query(
    `
    SELECT 
      c.*,
      r.id AS res_id,
      r.titre AS res_titre,
      r.fichier,
      r.nb_telechargements,
      r.afficher_compteur,
      r.visible AS res_visible
    FROM cours c
    LEFT JOIN ressources_cours r 
      ON c.id = r.cours_id
    WHERE c.id = $1 AND c.visible = true
    `,
    [id]
  );

  if (result.rows.length === 0) return null;

  // 🧠 transform data
  const course = {
    id: result.rows[0].id,
    intitule: result.rows[0].intitule,
    description: result.rows[0].description,
    niveau: result.rows[0].niveau,
    annee: result.rows[0].annee,
    type: result.rows[0].type,
    institution: result.rows[0].institution,
    ressources: []
  };

  result.rows.forEach(row => {
    if (row.res_id) {
      course.ressources.push({
        id: row.res_id,
        titre: row.res_titre,
        fichier: row.fichier,
        nb_telechargements: row.nb_telechargements,
        afficher_compteur: row.afficher_compteur,
        visible: row.res_visible
      });
    }
  });

  return course;
},
async findByIdPublic(id) {
  const result = await query(
    `SELECT * FROM cours WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
},
// ================= GET BY ID (WITH RESSOURCES) =================
async findByIdWithResources(id) {
  const courseResult = await query(
    `SELECT * FROM cours WHERE id = $1`,
    [id]
  );

  if (courseResult.rows.length === 0) return null;

  const ressourcesResult = await query(
    `SELECT id, cours_id, titre, fichier, nb_telechargements, afficher_compteur, visible
     FROM ressources_cours
     WHERE cours_id = $1 AND visible = true`,
    [id]
  );

  return {
    ...courseResult.rows[0],
    ressources: ressourcesResult.rows
  };
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
      `UPDATE cours
       SET ${fields.join(', ')}
       WHERE id = $${i++} AND utilisateur_id = $${i}
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // ================= DELETE =================
  async delete(id, utilisateur_id) {
    const result = await query(
      `DELETE FROM cours
       WHERE id = $1 AND utilisateur_id = $2
       RETURNING id`,
      [id, utilisateur_id]
    );
    return result.rowCount > 0;
  },

  // ================= STATS =================
  async getStats(utilisateur_id) {
    const result = await query(
      `SELECT
        COUNT(*) FILTER (WHERE type = 'CM') AS nb_cm,
        COUNT(*) FILTER (WHERE type = 'TD') AS nb_td,
        COUNT(*) FILTER (WHERE type = 'TP') AS nb_tp,
        COUNT(*) AS total_courses
       FROM cours
       WHERE utilisateur_id = $1`,
      [utilisateur_id]
    );

    return result.rows[0];
  }
};

module.exports = CoursModel;