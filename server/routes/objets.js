import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.id, o.libelle, o.statut, o.prix, c.libelle AS categorie
    FROM objet o
    JOIN categorie c ON c.id = o.categorie_id
    ORDER BY o.id DESC
  `);
  res.status(200).json(rows);
});

export default router;