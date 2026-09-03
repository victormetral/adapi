import 'dotenv/config';
import express from 'express';

import categoriesRouter from './routes/categories.js';
import objetsRouter from './routes/objets.js';
import depotsRouter from './routes/depots.js';
import personnesRouter from './routes/personnes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ping', (req, res) => {
    res.status(200).json({message:'pong'});
});

app.use(express.json());
app.use('/api/categories', categoriesRouter);
app.use('/api/objets', objetsRouter);
app.use('/api/depots', depotsRouter);
app.use('/api/personnes', personnesRouter);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
