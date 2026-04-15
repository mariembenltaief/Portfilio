const { query } = require('../config/db');

const ParametresModel = {

  // 🔓 PUBLIC PARAMETERS
 async getPublic() {
  const result = await query(
    `SELECT langue_principale 
     FROM parametres
     WHERE langue_principale IS NOT NULL
     LIMIT 1`
  );

  return {
    langue_defaut: result.rows[0]?.langue_principale || 'en'
  };
},


  // 🔒 CREATE DEFAULT USER PARAMS
  async createDefault(utilisateur_id) {
    const result = await query(
      `INSERT INTO parametres
       (utilisateur_id, langue_principale, langue_secondaire)
       VALUES ($1, $2, $3)
       ON CONFLICT (utilisateur_id) DO NOTHING
       RETURNING *`,
      [utilisateur_id, 'en', 'fr']
    );
    return result.rows[0];
  },


  // 🔒 FIND USER PARAMS
  async findByUser(utilisateur_id) {
    const result = await query(
      'SELECT * FROM parametres WHERE utilisateur_id = $1',
      [utilisateur_id]
    );
    return result.rows[0];
  },


  // 🔒 UPDATE USER PARAMS
  async updateUser(utilisateur_id, data) {
    const { langue_principale, langue_secondaire } = data;

    const result = await query(
      `UPDATE parametres
       SET langue_principale = COALESCE($1, langue_principale),
           langue_secondaire = COALESCE($2, langue_secondaire)
       WHERE utilisateur_id = $3
       RETURNING *`,
      [langue_principale, langue_secondaire, utilisateur_id]
    );

    return result.rows[0];
  }

};

module.exports = ParametresModel;