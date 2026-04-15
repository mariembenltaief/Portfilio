const { query } = require('../config/db');

const LiensExternesModel = {
  // Créer un lien
  async create(lienData) {
    const { utilisateur_id, type, url } = lienData;
    const result = await query(
      `INSERT INTO liens_externes (utilisateur_id, type, url)
       VALUES ($1, $2, $3)
       ON CONFLICT (utilisateur_id, type) 
       DO UPDATE SET url = EXCLUDED.url
       RETURNING *`,
      [utilisateur_id, type, url]
    );
    return result.rows[0];
  },

  // Trouver tous les liens d'un utilisateur spécifique
  async findAllByUser(utilisateur_id) {
    const result = await query(
      'SELECT * FROM liens_externes WHERE utilisateur_id = $1 ORDER BY type',
      [utilisateur_id]
    );
    return result.rows;
  },

  // Trouver tous les liens publics (sans jointure)
  async findAllPublic() {
    const result = await query(
      'SELECT * FROM liens_externes ORDER BY utilisateur_id, type'
    );
    return result.rows;
  },

  // Mettre à jour
  async update(id, utilisateur_id, url) {
    const result = await query(
      'UPDATE liens_externes SET url = $1 WHERE id = $2 AND utilisateur_id = $3 RETURNING *',
      [url, id, utilisateur_id]
    );
    return result.rows[0];
  },

  // Supprimer
  async delete(id, utilisateur_id) {
    const result = await query(
      'DELETE FROM liens_externes WHERE id = $1 AND utilisateur_id = $2 RETURNING id',
      [id, utilisateur_id]
    );
    return result.rows[0];
  }
};

module.exports = LiensExternesModel;