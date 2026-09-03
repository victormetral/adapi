import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { statut = null, categorie_id = null } = req.query;

  const { rows } = await pool.query(`
    SELECT o.id, o.libelle, o.statut, o.prix, c.libelle AS categorie
    FROM objet o
    JOIN categorie c ON c.id = o.categorie_id
    WHERE o.statut       = COALESCE($1::statut_objet, o.statut)
      AND o.categorie_id = COALESCE($2::integer,      o.categorie_id)
    ORDER BY o.id DESC
  `, [statut, categorie_id]);

  res.status(200).json(rows);
});

const STATUTS_VALIDES = ['arrive', 'en_reparation', 'en_rayon', 'vendu', 'recycle'];

router.patch('/:id/statut', async (req, res) => {
  const { statut, prix } = req.body;

  if (!statut) {
    return res.status(400).json({ erreur: 'statut est obligatoire' });
  }

  if (!STATUTS_VALIDES.includes(statut)) {
    return res.status(400).json({ erreur: `statut doit être l'un de : ${STATUTS_VALIDES.join(', ')}` });
  }

  const { rows } = await pool.query(`
    UPDATE objet
    SET statut = $1::statut_objet, prix = COALESCE($2, prix)
    WHERE id = $3
    RETURNING *
  `, [statut, prix ?? null, req.params.id]);

  if (rows.length === 0) {
    return res.status(404).json({ erreur: 'Objet introuvable' });
  }

  res.status(200).json(rows[0]);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.id, o.libelle, o.poids_kg, o.etat_arrivee, o.statut, o.prix,
           c.libelle AS categorie,
           d.id AS depot_id, d.date_depot, d.type AS type_depot,
           p.nom AS donatrice_nom, p.prenom AS donatrice_prenom
    FROM objet o
    JOIN categorie c ON c.id = o.categorie_id
    JOIN depot     d ON d.id = o.depot_id
    JOIN personne  p ON p.id = d.personne_id
    WHERE o.id = $1
  `, [req.params.id]);

  if (rows.length === 0) {
    return res.status(404).json({ erreur: 'Objet introuvable' });
  }

  res.status(200).json(rows[0]);
});

export default router; 