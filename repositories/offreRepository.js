const db = require('../config/db');

class offereRepository {
  static async findAll({ search, ville, contrat, tech } = {}) {
    let sql = `
      SELECT
        off.id, off.titre, off.description, off.type_contrat, off.salaire,
        off.date_publication,
        entr.nom AS entreprise_nom,
        entr.ville AS entreprise_ville,
        entr.logo AS entreprise_logo,
        GROUP_CONCAT(tech.nom) AS technologies 
      FROM offre off
      JOIN entreprise entr ON off.entreprise_id = entr.id
      LEFT JOIN offre_technologie offtech ON off.id = offtech.offre_id
      LEFT JOIN technologie tech ON offtech.technologie_id = tech.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += ` AND (off.titre LIKE ? OR off.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`); // إرسال قيمتين منفصلتين
    }

    if (ville) {
      sql += ` AND entr.ville = ?`;
      params.push(ville);
    }

    if (contrat) {
      sql += ` AND off.type_contrat = ?`;
      params.push(contrat);
    }

    if (tech) {
      sql += ` AND tech.nom = ?`;
      params.push(tech);
    }

    sql += ` GROUP BY off.id ORDER BY off.date_publication DESC`;

    const [rows] = await db.execute(sql, params);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT 
        off.*,
        entr.nom AS entreprise_nom, 
        entr.ville AS entreprise_ville, 
        entr.logo AS entreprise_logo,
        GROUP_CONCAT(tech.nom) AS technologies
      FROM offre off
      JOIN entreprise entr ON off.entreprise_id = entr.id
      LEFT JOIN offre_technologie offtech ON off.id = offtech.offre_id
      LEFT JOIN technologie tech ON offtech.technologie_id = tech.id
      WHERE off.id = ?
      GROUP BY off.id
    `;

    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = offereRepository;