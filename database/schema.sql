DROP TABLE IF EXISTS offre_technologie;
DROP TABLE IF EXISTS offre;
DROP TABLE IF EXISTS technologie;
DROP TABLE IF EXISTS entreprise;

CREATE TABLE entreprise (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    logo VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE technologie (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE offre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type_contrat VARCHAR(50) NOT NULL,
    salaire VARCHAR(100),
    date_publication DATE NOT NULL,
    entreprise_id INT NOT NULL,
    FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE offre_technologie (
    offre_id INT NOT NULL,
    technologie_id INT NOT NULL,
    PRIMARY KEY (offre_id, technologie_id),
    FOREIGN KEY (offre_id) REFERENCES offre(id) ON DELETE CASCADE,
    FOREIGN KEY (technologie_id) REFERENCES technologie(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;