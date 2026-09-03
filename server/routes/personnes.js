import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { nom, prenom, telephone, adherente } = req.body;

  if (!nom || !prenom) {
    return res.status(400).json({ erreur: 'nom et prenom sont obligatoires' });
  }

  const { rows } = await pool.query(`
    INSERT INTO personne (nom, prenom, telephone, adherente)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [nom, prenom, telephone ?? null, adherente ?? false]);

  res.status(201).json(rows[0]);
});

export default router;