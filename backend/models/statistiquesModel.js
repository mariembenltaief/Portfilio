const { query } = require('../config/db');

const StatistiquesModel = {
  // Créer les statistiques par défaut
  async createDefault(utilisateur_id) {
    const result = await query(
      `INSERT INTO statistiques (utilisateur_id, nb_cours, nb_publications, nb_projets, nb_blogs)
       VALUES ($1, 0, 0, 0, 0)
       ON CONFLICT (utilisateur_id) DO NOTHING
       RETURNING *`,
      [utilisateur_id]
    );
    return result.rows[0];
  },

  // Trouver les statistiques d'un utilisateur
  async findByUser(utilisateur_id) {
    const result = await query(
      'SELECT * FROM statistiques WHERE utilisateur_id = $1',
      [utilisateur_id]
    );
    return result.rows[0];
  },

  // Mettre à jour les statistiques
  async update(utilisateur_id, type, count) {
    const fieldMap = {
      'cours': 'nb_cours',
      'publications': 'nb_publications',
      'projets': 'nb_projets',
      'blogs': 'nb_blogs'
    };
    
    const field = fieldMap[type];
    if (!field) return null;
    
    const result = await query(
      `UPDATE statistiques 
       SET ${field} = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE utilisateur_id = $2
       RETURNING *`,
      [count, utilisateur_id]
    );
    return result.rows[0];
  },

  // Actualiser toutes les statistiques
  async refreshAll(utilisateur_id) {
    const [coursCount, pubsCount, projetsCount, blogsCount] = await Promise.all([
      query('SELECT COUNT(*) as count FROM cours WHERE utilisateur_id = $1', [utilisateur_id]),
      query('SELECT COUNT(*) as count FROM publications WHERE utilisateur_id = $1', [utilisateur_id]),
      query('SELECT COUNT(*) as count FROM projets_recherche WHERE utilisateur_id = $1', [utilisateur_id]),
      query('SELECT COUNT(*) as count FROM articles_blog WHERE utilisateur_id = $1', [utilisateur_id])
    ]);
    
    const result = await query(
      `UPDATE statistiques 
       SET nb_cours = $1, nb_publications = $2, nb_projets = $3, nb_blogs = $4, updated_at = CURRENT_TIMESTAMP
       WHERE utilisateur_id = $5
       RETURNING *`,
      [
        parseInt(coursCount.rows[0].count),
        parseInt(pubsCount.rows[0].count),
        parseInt(projetsCount.rows[0].count),
        parseInt(blogsCount.rows[0].count),
        utilisateur_id
      ]
    );
    return result.rows[0];
  }
};

module.exports = StatistiquesModel;