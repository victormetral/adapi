-- =====================================================================
--  Adatabase — La Remise
--  migration_down.sql — suppression complète
--
--  Ordre inverse exact du up : niveau 3 → 2 → 1 → 0, PUIS les types.
--  IF EXISTS partout : le script doit passer même si rien n'existe.
-- =====================================================================


-- Niveau 3
DROP TABLE IF EXISTS reparation;

-- Niveau 2
DROP TABLE IF EXISTS inscription;
DROP TABLE IF EXISTS objet;

-- Niveau 1
DROP TABLE IF EXISTS benevole_competence;
DROP TABLE IF EXISTS atelier;
DROP TABLE IF EXISTS depot;

-- Niveau 0
DROP TABLE IF EXISTS vente;
DROP TABLE IF EXISTS categorie;
DROP TABLE IF EXISTS competence;
DROP TABLE IF EXISTS benevole;
DROP TABLE IF EXISTS personne;

-- Les types en dernier : une table les utilisait encore
DROP TYPE IF EXISTS mode_paiement;
DROP TYPE IF EXISTS resultat_reparation;
DROP TYPE IF EXISTS statut_objet;
DROP TYPE IF EXISTS etat_objet;
DROP TYPE IF EXISTS type_depot;