const { query } = require('../config/db');

const ArticlesBlogModel = {
  // Créer un article
  async create(articleData) {
    const { utilisateur_id, titre, contenu, categorie, langue, date_publication, visible } = articleData;
    const result = await query(
      `INSERT INTO articles_blog (utilisateur_id, titre, contenu, categorie, langue, date_publication, visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [utilisateur_id, titre, contenu, categorie, langue, date_publication || new Date(), visible !== false]
    );
    return result.rows[0];
  },

  // Trouver tous les articles (avec filtre optionnel par utilisateur)
  async findAll(utilisateur_id = null, filters = {}) {
    let queryText = 'SELECT * FROM articles_blog WHERE 1=1';
    let params = [];
    let paramIndex = 1;
    
    if (utilisateur_id) {
      queryText += ` AND utilisateur_id = $${paramIndex++}`;
      params.push(utilisateur_id);
    }
    
    if (filters.langue) {
      queryText += ` AND langue = $${paramIndex++}`;
      params.push(filters.langue);
    }
    if (filters.annee) {
      queryText += ` AND EXTRACT(YEAR FROM date_publication) = $${paramIndex++}`;
      params.push(parseInt(filters.annee));
    }
    if (filters.categorie) {
      queryText += ` AND categorie ILIKE $${paramIndex++}`;
      params.push(`%${filters.categorie}%`);
    }
    if (filters.visible !== undefined) {
      queryText += ` AND visible = $${paramIndex++}`;
      params.push(filters.visible);
    }
    
    queryText += ' ORDER BY date_publication DESC';
    
    const result = await query(queryText, params);
    return result.rows;
  },

  // Trouver tous les articles d'un utilisateur (méthode existante)
  async findAllByUser(utilisateur_id, filters = {}) {
    return this.findAll(utilisateur_id, filters);
  },

  // Trouver par ID (avec utilisateur)
  async findById(id, utilisateur_id) {
    const result = await query(
      'SELECT * FROM articles_blog WHERE id = $1 AND utilisateur_id = $2',
      [id, utilisateur_id]
    );
    return result.rows[0];
  },

  // Trouver par ID (public - seulement les articles visibles)
  async findPublicById(id) {
    const result = await query(
      'SELECT * FROM articles_blog WHERE id = $1 AND visible = true',
      [id]
    );
    return result.rows[0];
  },

  // Trouver les articles récents (public)
  async findRecent(utilisateur_id = null, limit = 5) {
    let queryText = `SELECT * FROM articles_blog WHERE visible = true`;
    let params = [limit];
    let paramIndex = 1;
    
    if (utilisateur_id) {
      queryText += ` AND utilisateur_id = $${paramIndex++}`;
      params.unshift(utilisateur_id);
      params.push(limit);
    } else {
      params = [limit];
    }
    
    queryText += ` ORDER BY date_publication DESC LIMIT $${paramIndex}`;
    
    const result = await query(queryText, params);
    return result.rows;
  },

  // Obtenir les années avec articles (pour un utilisateur)
  async getYearsWithPosts(utilisateur_id) {
    const result = await query(
      `SELECT 
        EXTRACT(YEAR FROM date_publication) as year,
        COUNT(*) as count
       FROM articles_blog 
       WHERE utilisateur_id = $1
       GROUP BY year
       ORDER BY year DESC`,
      [utilisateur_id]
    );
    return result.rows;
  },

  // Obtenir les années avec articles (public - seulement les articles visibles)
  async getYearsWithPublicPosts() {
    const result = await query(
      `SELECT 
        EXTRACT(YEAR FROM date_publication) as year,
        COUNT(*) as count
       FROM articles_blog 
       WHERE visible = true
       GROUP BY year
       ORDER BY year DESC`
    );
    return result.rows;
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
      `UPDATE articles_blog SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND utilisateur_id = $${paramIndex}
       RETURNING *`,
      values
    );
    return result.rows[0];
  },

  // Supprimer
  async delete(id, utilisateur_id) {
    const result = await query(
      'DELETE FROM articles_blog WHERE id = $1 AND utilisateur_id = $2 RETURNING id',
      [id, utilisateur_id]
    );
    return result.rows[0];
  }
};

module.exports = ArticlesBlogModel;