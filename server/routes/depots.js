import { Router } from 'express';
import pool from '../db.js';

const router = Router();

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