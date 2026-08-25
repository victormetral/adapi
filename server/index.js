import 'dotenv/config';
import express from 'express';

import categoriesRouter from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ping', (req, res) => {
    res.status(200).json({message:'pong'});
});

app.use('/api/categories', categoriesRouter);

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
