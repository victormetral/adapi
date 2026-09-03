import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const parStatut = await pool.query(`
    SELECT statut, COUNT(*)::integer AS total
    FROM objet
    GROUP BY statut
  `);

  const poids = await pool.query(`
    SELECT
      COALESCE(SUM(poids_kg), 0) AS poids_total,
      COALESCE(SUM(poids_kg) FILTER (WHERE statut != 'recycle'), 0) AS poids_detourne
    FROM objet
  `);

  res.status(200).json({
    objets_par_statut: parStatut.rows,
    poids_total_kg: poids.rows[0].poids_total,
    poids_detourne_kg: poids.rows[0].poids_detourne,
  });
});

export default router;