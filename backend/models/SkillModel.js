// models/SkillModel.js
const { v4: uuidv4 } = require("uuid");

class SkillModel {
  constructor(db) {
    this.db = db;
  }

  async getPublic() {
    const result = await this.db.query(`
      SELECT
        vs.id,
        vs.label,
        vs.icon,
        vs.pct,
        vs.ordre,
        vs.created_at
      FROM visiteur_skills vs
      JOIN visiteurs v ON v.id = vs.visiteur_id
      WHERE v.visible = true
      ORDER BY vs.ordre ASC, vs.created_at ASC
    `);
    return result.rows;
  }

  async getByVisiteur(visiteurId) {
    const result = await this.db.query(
      `SELECT id, label, icon, pct, ordre, created_at, updated_at
       FROM visiteur_skills
       WHERE visiteur_id = $1
       ORDER BY ordre ASC, created_at ASC`,
      [visiteurId]
    );
    return result.rows;
  }

  async create(visiteurId, { label, icon = "◆", pct, ordre = 0 }) {
    const result = await this.db.query(
      `INSERT INTO visiteur_skills (id, visiteur_id, label, icon, pct, ordre)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, label, icon, pct, ordre, created_at`,
      [uuidv4(), visiteurId, label.trim(), icon, Number(pct), Number(ordre)]
    );
    return result.rows[0];
  }

  async update(id, visiteurId, { label, icon, pct, ordre }) {
    const result = await this.db.query(
      `UPDATE visiteur_skills
       SET label = COALESCE($1, label),
           icon = COALESCE($2, icon),
           pct = COALESCE($3, pct),
           ordre = COALESCE($4, ordre),
           updated_at = NOW()
       WHERE id = $5 AND visiteur_id = $6
       RETURNING id, label, icon, pct, ordre, updated_at`,
      [label?.trim(), icon, pct !== undefined ? Number(pct) : null, 
       ordre !== undefined ? Number(ordre) : null, id, visiteurId]
    );
    return result.rows[0];
  }

  async delete(id, visiteurId) {
    const result = await this.db.query(
      `DELETE FROM visiteur_skills WHERE id = $1 AND visiteur_id = $2`,
      [id, visiteurId]
    );
    return result.rowCount > 0;
  }

  async reorder(visiteurId, orderedIds) {
    for (let i = 0; i < orderedIds.length; i++) {
      await this.db.query(
        `UPDATE visiteur_skills SET ordre = $1 WHERE id = $2 AND visiteur_id = $3`,
        [i + 1, orderedIds[i], visiteurId]
      );
    }
  }
}

module.exports = SkillModel;