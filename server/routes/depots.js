import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { personne_id, date_depot, type } = req.body;

  if (!personne_id || !date_depot || !type) {
    return res.status(400).json({ erreur: 'personne_id, date_depot et type sont obligatoires' });
  }

  if (!['boutique', 'domicile'].includes(type)) {
    return res.status(400).json({ erreur: 'type doit être boutique ou domicile' });
  }

  const personne = await pool.query('SELECT id FROM personne WHERE id = $1', [personne_id]);
  if (personne.rows.length === 0) {
    return res.status(400).json({ erreur: 'personne_id inconnu' });
  }

  const { rows } = await pool.query(`
    INSERT INTO depot (date_depot, type, personne_id)
    VALUES ($1, $2::type_depot, $3)
    RETURNING *
  `, [date_depot, type, personne_id]);

  res.status(201).json(rows[0]);
});

router.post('/:id/objets', async (req, res) => {
  const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;
  const depot_id = req.params.id;

  if (!libelle || poids_kg === undefined || !etat_arrivee || !categorie_id) {
    return res.status(400).json({ erreur: 'libelle, poids_kg, etat_arrivee et categorie_id sont obligatoires' });
  }

  if (typeof poids_kg !== 'number') {
    return res.status(400).json({ erreur: 'poids_kg doit être un nombre' });
  }

  if (!['bon_etat', 'a_reparer', 'hors_service'].includes(etat_arrivee)) {
    return res.status(400).json({ erreur: 'etat_arrivee invalide' });
  }

  const depot = await pool.query('SELECT id FROM depot WHERE id = $1', [depot_id]);
  if (depot.rows.length === 0) {
    return res.status(404).json({ erreur: 'Dépôt introuvable' });
  }

  const categorie = await pool.query('SELECT id FROM categorie WHERE id = $1', [categorie_id]);
  if (categorie.rows.length === 0) {
    return res.status(400).json({ erreur: 'categorie_id inconnu' });
  }

  const { rows } = await pool.query(`
    INSERT INTO objet (libelle, poids_kg, etat_arrivee, categorie_id, depot_id)
    VALUES ($1, $2, $3::etat_objet, $4, $5)
    RETURNING *
  `, [libelle, poids_kg, etat_arrivee, categorie_id, depot_id]);

  res.status(201).json(rows[0]);
});

router.get('/:id', async (req, res) => {
  const depotResult = await pool.query(`
    SELECT d.id, d.date_depot, d.type,
           p.id AS donatrice_id, p.nom, p.prenom, p.telephone, p.adherente
    FROM depot d
    JOIN personne p ON p.id = d.personne_id
    WHERE d.id = $1
  `, [req.params.id]);

  if (depotResult.rows.length === 0) {
    return res.status(404).json({ erreur: 'Dépôt introuvable' });
  }

  const objetsResult = await pool.query(`
    SELECT o.id, o.libelle, o.poids_kg, o.statut, o.prix, c.libelle AS categorie
    FROM objet o
    JOIN categorie c ON c.id = o.categorie_id
    WHERE o.depot_id = $1
    ORDER BY o.id
  `, [req.params.id]);

  const d = depotResult.rows[0];

  res.status(200).json({
    id: d.id,
    date_depot: d.date_depot,
    type: d.type,
    donatrice: {
      id: d.donatrice_id,
      nom: d.nom,
      prenom: d.prenom,
      telephone: d.telephone,
      adherente: d.adherente,
    },
    objets: objetsResult.rows,
  });
});

export default router;