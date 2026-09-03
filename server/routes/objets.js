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

export default router; 