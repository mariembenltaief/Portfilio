const pool = require('../config/db');

const RessourcesCoursModel = {
  // ================== CREATE ==================
  async create(ressourceData) {
    const { 
      cours_id, 
      titre, 
      fichier, 
      afficher_compteur = true, 
      visible = true 
    } = ressourceData;
    
    const query = `
      INSERT INTO ressources_cours (
        id, cours_id, titre, fichier, afficher_compteur, visible, nb_telechargements
      ) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, 0)
      RETURNING *
    `;
    
    const values = [
      cours_id,
      titre || 'Sans titre',
      fichier,
      afficher_compteur,
      visible
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ================== FIND BY COURSE ==================
 async findByCourse(cours_id) {
  const query = `
    SELECT r.*, c.intitule as cours_intitule, c.type as cours_type
    FROM ressources_cours r
    JOIN cours c ON r.cours_id = c.id
    WHERE r.cours_id = $1
    AND r.visible = true
    ORDER BY r.titre
  `;

  const result = await pool.query(query, [cours_id]);
  return result.rows;
},
async findByIdPublic(id) {
  const query = `
    SELECT * FROM cours
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
},
  // ================== FIND BY ID ==================
  async findById(id, utilisateur_id = null) {
    let query = `
      SELECT r.*, 
             c.id as cours_id, c.intitule as cours_intitule, 
             c.utilisateur_id, c.visible as cours_visible,
             v.nom, v.prenom
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      LEFT JOIN visiteurs v ON c.utilisateur_id = v.id
      WHERE r.id = $1
    `;
    
    const values = [id];
    
    if (utilisateur_id) {
      query += ` AND (c.utilisateur_id = $2 OR (r.visible = true AND c.visible = true))`;
      values.push(utilisateur_id);
    } else {
      query += ` AND r.visible = true AND c.visible = true`;
    }
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  // ================== FIND ALL BY USER ==================
  async findAllByUser(utilisateur_id) {
    const query = `
      SELECT r.*, c.intitule as cours_intitule, c.type as cours_type, c.niveau
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      WHERE c.utilisateur_id = $1
      ORDER BY r.date_creation DESC, r.titre
    `;
    
    const result = await pool.query(query, [utilisateur_id]);
    return result.rows;
  },

  // ================== INCREMENT DOWNLOADS ==================
  async incrementDownloads(id) {
    const query = `
      UPDATE ressources_cours 
      SET nb_telechargements = nb_telechargements + 1 
      WHERE id = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // ================== UPDATE ==================
  async update(id, utilisateur_id, updateData) {
    // Vérifier d'abord que la ressource appartient à l'utilisateur
    const checkQuery = `
      SELECT r.*, c.utilisateur_id 
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      WHERE r.id = $1 AND c.utilisateur_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, utilisateur_id]);
    
    if (checkResult.rows.length === 0) {
      return null;
    }

    const { titre, fichier, afficher_compteur, visible } = updateData;
    
    let updateQuery = 'UPDATE ressources_cours SET ';
    const values = [];
    const updates = [];
    let paramIndex = 1;

    if (titre !== undefined) {
      updates.push(`titre = $${paramIndex}`);
      values.push(titre);
      paramIndex++;
    }
    if (fichier !== undefined) {
      updates.push(`fichier = $${paramIndex}`);
      values.push(fichier);
      paramIndex++;
    }
    if (afficher_compteur !== undefined) {
      updates.push(`afficher_compteur = $${paramIndex}`);
      values.push(afficher_compteur);
      paramIndex++;
    }
    if (visible !== undefined) {
      updates.push(`visible = $${paramIndex}`);
      values.push(visible);
      paramIndex++;
    }

    if (updates.length === 0) {
      return checkResult.rows[0];
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(updateQuery, values);
    return result.rows[0];
  },

  // ================== UPDATE VISIBILITY ==================
  async updateVisibility(id, utilisateur_id, visible, afficher_compteur) {
    // Vérifier que la ressource appartient à l'utilisateur
    const checkQuery = `
      SELECT r.id 
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      WHERE r.id = $1 AND c.utilisateur_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, utilisateur_id]);
    
    if (checkResult.rows.length === 0) {
      return null;
    }

    let updateQuery = 'UPDATE ressources_cours SET ';
    const values = [];
    const updates = [];
    let paramIndex = 1;

    if (visible !== undefined) {
      updates.push(`visible = $${paramIndex}`);
      values.push(visible);
      paramIndex++;
    }
    if (afficher_compteur !== undefined) {
      updates.push(`afficher_compteur = $${paramIndex}`);
      values.push(afficher_compteur);
      paramIndex++;
    }

    if (updates.length === 0) {
      return checkResult.rows[0];
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(updateQuery, values);
    return result.rows[0];
  },

  // ================== DELETE ==================
  async delete(id, utilisateur_id) {
  const selectQuery = `
    SELECT r.fichier
    FROM ressources_cours r
    JOIN cours c ON r.cours_id = c.id
    WHERE r.id = $1 AND c.utilisateur_id = $2
  `;

  const selectResult = await pool.query(selectQuery, [id, utilisateur_id]);

  if (selectResult.rows.length === 0) {
    return null;
  }

  const file = selectResult.rows[0].fichier;

  await pool.query(
    `DELETE FROM ressources_cours WHERE id = $1`,
    [id]
  );

  return { fichier: file };
},

  // ================== GET STATS ==================
  async getStats(utilisateur_id) {
    const query = `
      SELECT 
        COUNT(*) as total_ressources,
        SUM(nb_telechargements) as total_telechargements,
        COUNT(CASE WHEN visible = true THEN 1 END) as ressources_visibles,
        COUNT(CASE WHEN visible = false THEN 1 END) as ressources_cachees
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      WHERE c.utilisateur_id = $1
    `;
    
    const result = await pool.query(query, [utilisateur_id]);
    return result.rows[0];
  },

  // ================== GET POPULAR ==================
  async getMostDownloaded(utilisateur_id, limit = 5) {
    const query = `
      SELECT r.*, c.intitule as cours_intitule, c.type as cours_type
      FROM ressources_cours r
      JOIN cours c ON r.cours_id = c.id
      WHERE c.utilisateur_id = $1 AND r.afficher_compteur = true
      ORDER BY r.nb_telechargements DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [utilisateur_id, limit]);
    return result.rows;
  }
};

module.exports = RessourcesCoursModel;