const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

const accountRouter = require('./routes/account');
const decksRouter = require('./routes/decks');
const cardsRouter = require('./routes/cards');
const dungeonsRouter = require('./routes/dungeons');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});

app.use('/api/account', accountRouter);
app.use('/api/decks', decksRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/dungeons', dungeonsRouter);
