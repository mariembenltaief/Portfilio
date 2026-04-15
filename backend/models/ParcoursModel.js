// models/ParcoursModel.js
const { v4: uuidv4 } = require("uuid");

class ParcoursModel {
  constructor(db) {
    this.db = db;
  }

  async getPublic() {
    const result = await this.db.query(`
      SELECT
        vp.id,
        vp.period,
        vp.titre,
        vp.lieu,
        vp.ordre,
        vp.created_at
      FROM visiteur_parcours vp
      JOIN visiteurs v ON v.id = vp.visiteur_id
      WHERE v.visible = true
      ORDER BY vp.ordre ASC, vp.created_at ASC
    `);
    return result.rows;
  }

  async getByVisiteur(visiteurId) {
    const result = await this.db.query(
      `SELECT id, period, titre, lieu, ordre, created_at, updated_at
       FROM visiteur_parcours
       WHERE visiteur_id = $1
       ORDER BY ordre ASC, created_at ASC`,
      [visiteurId]
    );
    return result.rows;
  }

  async create(visiteurId, { period, titre, lieu = "", ordre = 0 }) {
    const result = await this.db.query(
      `INSERT INTO visiteur_parcours (id, visiteur_id, period, titre, lieu, ordre)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, period, titre, lieu, ordre, created_at`,
      [uuidv4(), visiteurId, period.trim(), titre.trim(), lieu.trim(), Number(ordre)]
    );
    return result.rows[0];
  }

  async update(id, visiteurId, { period, titre, lieu, ordre }) {
    const result = await this.db.query(
      `UPDATE visiteur_parcours
       SET period = COALESCE($1, period),
           titre = COALESCE($2, titre),
           lieu = COALESCE($3, lieu),
           ordre = COALESCE($4, ordre),
           updated_at = NOW()
       WHERE id = $5 AND visiteur_id = $6
       RETURNING id, period, titre, lieu, ordre, updated_at`,
      [period?.trim(), titre?.trim(), lieu?.trim(), 
       ordre !== undefined ? Number(ordre) : null, id, visiteurId]
    );
    return result.rows[0];
  }

  async delete(id, visiteurId) {
    const result = await this.db.query(
      `DELETE FROM visiteur_parcours WHERE id = $1 AND visiteur_id = $2`,
      [id, visiteurId]
    );
    return result.rowCount > 0;
  }

  async reorder(visiteurId, orderedIds) {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.db.query(
        `UPDATE visiteur_parcours SET ordre = $1 WHERE id = $2 AND visiteur_id = $3`,
        [i + 1, orderedIds[i], visiteurId]
      );
    }
  }
}

module.exports = ParcoursModel;