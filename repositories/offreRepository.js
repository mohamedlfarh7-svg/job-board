const db = require('../config/db');

class offereRepository {
  static async findAll({ search, ville, contrat, tech } = {}) {
    let sql = `
      SELECT
        off.*,
        entr.nom AS entreprise_nom,
        entr.ville AS entreprise_ville,
        entr.logo AS entreprise_logo,
        GROUP_CONCAT(tech.nom) AS technologies 
      FROM offre off
      LEFT JOIN entreprise entr ON off.entreprise_id = entr.id
      LEFT JOIN offre_technologie offtech ON off.id = offtech.offre_id
      LEFT JOIN technologie tech ON offtech.technologie_id = tech.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += ` AND (off.titre LIKE ? OR off.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (ville) {
      sql += ` AND (entr.ville = ? OR off.ville = ?)`;
      params.push(ville, ville);
    }

    if (contrat) {
      sql += ` AND (off.type_contrat = ? OR off.contrat = ?)`;
      params.push(contrat, contrat);
    }

    if (tech) {
      sql += ` AND tech.nom = ?`;
      params.push(tech);
    }

    sql += ` GROUP BY off.id ORDER BY off.id DESC`;

    const [rows] = await db.execute(sql, params);

    // Kanjido l-fallback f-JS bash ma-y'bqa ḥta ḥaja NULL:
    return rows.map(item => ({
      ...item,
      entreprise_nom: item.entreprise_nom || item.entreprise || 'Entreprise',
      entreprise_ville: item.entreprise_ville || item.ville || 'Non spécifiée',
      type_contrat: item.type_contrat || item.contrat || 'CDI',
      date_publication: item.date_publication || new Date()
    }));
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
      LEFT JOIN entreprise entr ON off.entreprise_id = entr.id
      LEFT JOIN offre_technologie offtech ON off.id = offtech.offre_id
      LEFT JOIN technologie tech ON offtech.technologie_id = tech.id
      WHERE off.id = ?
      GROUP BY off.id
    `;

    const [rows] = await db.execute(sql, [id]);
    if (!rows[0]) return null;

    const item = rows[0];
    return {
      ...item,
      entreprise_nom: item.entreprise_nom || item.entreprise || 'Entreprise',
      entreprise_ville: item.entreprise_ville || item.ville || 'Non spécifiée',
      type_contrat: item.type_contrat || item.contrat || 'CDI',
      date_publication: item.date_publication || new Date()
    };
  }

  static async findAllWithApplicationsCount() {
    const sql = `
      SELECT 
        off.*, 
        COUNT(c.id) AS total_candidatures
      FROM offre off
      LEFT JOIN candidatures c ON off.id = c.offre_id
      GROUP BY off.id
      ORDER BY off.id DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async createApplication(data) {
    const { offre_id, nom, email, cv_path, message } = data;
    const sql = `
      INSERT INTO candidatures (offre_id, nom, email, cv_path, message, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.execute(sql, [offre_id, nom, email, cv_path, message]);
    return result;
  }

  static async findCandidatApplications(email) {
    const sql = `
      SELECT 
        c.id AS candidature_id,
        c.created_at AS date_candidature,
        c.cv_path,
        c.message,
        o.*
      FROM candidatures c
      JOIN offre o ON c.offre_id = o.id
      WHERE c.email = ?
      ORDER BY c.created_at DESC
    `;
    const [rows] = await db.query(sql, [email]);
    return rows;
  }

  static async create(data = {}) {
    const { 
      titre = '', 
      entreprise = '', 
      description = '', 
      ville = '', 
      contrat = 'CDI', 
      type_contrat = 'CDI',
      salaire = null 
    } = data;

    const sql = `
      INSERT INTO offre (titre, entreprise, description, ville, contrat, type_contrat, salaire, date_publication)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [titre, entreprise, description, ville, contrat, type_contrat || contrat, salaire]);
    return result.insertId;
  }

  static async update(id, data) {
    const { titre, entreprise, description, ville, contrat, type_contrat, salaire } = data;
    const sql = `
      UPDATE offre 
      SET titre = ?, entreprise = ?, description = ?, ville = ?, contrat = ?, type_contrat = ?, salaire = ? 
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [titre, entreprise, description, ville, contrat, type_contrat || contrat, salaire, id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const sql = `DELETE FROM offre WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = offereRepository;