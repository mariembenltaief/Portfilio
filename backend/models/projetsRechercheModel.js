const { query } = require('../config/db');

const ProjetsRechercheModel = {
  // Créer un projet
  async create(projetData) {
    const { utilisateur_id, titre, description, axe_recherche, date_debut, date_fin, visible } = projetData;
    const result = await query(
      `INSERT INTO projets_recherche (utilisateur_id, titre, description, axe_recherche, date_debut, date_fin, visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [utilisateur_id, titre, description, axe_recherche, date_debut, date_fin, visible !== false]
    );
    return result.rows[0];
  },

  // Trouver tous les projets d'un utilisateur
  async findAllByUser(utilisateur_id, filters = {}) {
    let queryText = 'SELECT * FROM projets_recherche WHERE utilisateur_id = $1';
    let params = [utilisateur_id];
    let paramIndex = 2;
    
    if (filters.axe_recherche) {
      queryText += ` AND axe_recherche = $${paramIndex++}`;
      params.push(filters.axe_recherche);
    }
    if (filters.visible !== undefined) {
      queryText += ` AND visible = $${paramIndex++}`;
      params.push(filters.visible);
    }
    
    queryText += ' ORDER BY date_debut DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  },

  // Trouver tous les projets publics (visibles) - SANS jointure
  async findAllPublic(filters = {}) {
    let queryText = 'SELECT * FROM projets_recherche WHERE visible = true';
    let params = [];
    let paramIndex = 1;
    
    if (filters.axe_recherche) {
      queryText += ` AND axe_recherche = $${paramIndex++}`;
      params.push(filters.axe_recherche);
    }
    
    queryText += ' ORDER BY date_debut DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  },

  // Trouver par ID (avec vérification utilisateur)
  async findById(id, utilisateur_id) {
    const result = await query(
      'SELECT * FROM projets_recherche WHERE id = $1 AND utilisateur_id = $2',
      [id, utilisateur_id]
    );
    return result.rows[0];
  },

  // Trouver par ID (public - seulement si visible) - SANS jointure
  async findPublicById(id) {
    const result = await query(
      'SELECT * FROM projets_recherche WHERE id = $1 AND visible = true',
      [id]
    );
    return result.rows[0];
  },

  // Mettre à jour
  async update(id, utilisateur_id, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;
    
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex++}`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) return null;
    
    values.push(id, utilisateur_id);
    
    const result = await query(
      `UPDATE projets_recherche SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND utilisateur_id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0];
  },

  // Supprimer
  async delete(id, utilisateur_id) {
    const result = await query(
      'DELETE FROM projets_recherche WHERE id = $1 AND utilisateur_id = $2 RETURNING id',
      [id, utilisateur_id]
    );
    return result.rows[0];
  },

  // Compter les projets actifs
  async countActive(utilisateur_id) {
    const result = await query(
      `SELECT COUNT(*) as count 
       FROM projets_recherche 
       WHERE utilisateur_id = $1 
         AND (date_fin IS NULL OR date_fin >= CURRENT_DATE)`,
      [utilisateur_id]
    );
    return parseInt(result.rows[0].count);
  }
};

module.exports = ProjetsRechercheModel;