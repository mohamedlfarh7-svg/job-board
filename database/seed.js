const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSeed() {
  console.log(' Starting database seeding...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'job_board_db'}\`;`);
    await connection.changeUser({ database: process.env.DB_NAME || 'job_board_db' });

    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await connection.query(schemaSql);
    console.log('✅ Schema tables created successfully.');

    const [entResult] = await connection.query(`
      INSERT INTO entreprise (nom, ville, logo) VALUES 
      ('TechCorp', 'Casablanca', 'techcorp.png'),
      ('WebStudio', 'Rabat', 'webstudio.png'),
      ('DevAgency', 'Tanger', 'devagency.png'),
      ('DataInnov', 'Casablanca', 'datainnov.png'),
      ('CloudServices', 'Marrakech', 'cloud.png');
    `);

    await connection.query(`
      INSERT INTO technologie (nom) VALUES 
      ('JavaScript'), ('Node.js'), ('Express'), ('MySQL'), 
      ('React'), ('Vue.js'), ('PHP'), ('Laravel');
    `);

    await connection.query(`
      INSERT INTO offre (titre, description, type_contrat, salaire, date_publication, entreprise_id) VALUES 
      ('Développeur Full-stack Express/EJS', 'Nous recherchons un développeur Node.js/Express passionné.', 'CDI', '10000 DH', '2026-09-20', 1),
      ('Développeur Frontend React', 'Rejoignez notre équipe pour créer des interfaces modernes.', 'CDI', '9000 DH', '2026-09-21', 2),
      ('Développeur Backend PHP/Laravel', 'Conception et développement d API REST robustes.', 'CDD', '8000 DH', '2026-09-18', 3),
      ('Stage Full-stack Web', 'Stage PFE pour étudiant motivé en développement web.', 'Stage', '3000 DH', '2026-09-22', 1),
      ('Développeur Node.js / MySQL', 'Gestion de bases de données et APIs Express.', 'CDI', '11000 DH', '2026-09-19', 4),
      ('Intégrateur Web & Vue.js', 'Création d intégrations HTML/CSS et composants Vue.', 'Freelance', '400 DH/jour', '2026-09-15', 5),
      ('Développeur Mobile React Native', 'Développement d applications mobiles iOS et Android.', 'CDI', '12000 DH', '2026-09-17', 2),
      ('Développeur Web Junior', 'Poste pour débutant avec connaissances JS et SQL.', 'CDI', '7000 DH', '2026-09-23', 3),
      ('Lead Developer Full-stack', 'Encadrement d une équipe de 5 développeurs.', 'CDI', '18000 DH', '2026-09-10', 1),
      ('Développeur Backend Senior', 'Expertise Node.js, Architecture Microservices et MySQL.', 'CDI', '16000 DH', '2026-09-12', 4),
      ('Stage Développeur Frontend', 'Integration de maquettes Figma en EJS / Tailwind.', 'Stage', '2500 DH', '2026-09-23', 5),
      ('Développeur PHP / Vue.js', 'Maintenance et évolution d une plateforme e-commerce.', 'CDD', '8500 DH', '2026-09-14', 2);
    `);

    await connection.query(`
      INSERT INTO offre_technologie (offre_id, technologie_id) VALUES 
      (1, 1), (1, 2), (1, 3), (1, 4),
      (2, 1), (2, 5),
      (3, 7), (3, 8),
      (4, 1), (4, 2), (4, 4),
      (5, 2), (5, 3), (5, 4),
      (6, 1), (6, 6),
      (7, 1), (7, 5),
      (8, 1), (8, 4),
      (9, 1), (9, 2), (9, 3), (9, 4),
      (10, 2), (10, 3), (10, 4),
      (11, 1),
      (12, 6), (12, 7);
    `);

    console.log(' Database seeded successfully with companies, techs, and offers!');
  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await connection.end();
  }
}

runSeed();