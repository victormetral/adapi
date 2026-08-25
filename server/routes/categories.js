import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, libelle FROM categorie ORDER BY libelle');
  res.status(200).json(rows);
});

export default router;