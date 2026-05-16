const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});

// === DECKS API ===

app.get('/api/decks', (req, res) => {
    const { user_id } = req.query;
    const decks = db.prepare('SELECT * FROM decks WHERE user_id = ?').all(user_id);
    res.json(decks);
});

app.post('/api/decks', (req, res) => {
    const { user_id, name } = req.body;
    const result = db.prepare('INSERT INTO decks (user_id, name) VALUES (?, ?)').run(user_id, name);
    const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(result.lastInsertRowid);
    res.json(deck);
});

app.delete('/api/decks/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM decks WHERE id = ?').run(id);
    res.json( { success: true } );
});

// === CARDS API ===

app.get('/api/decks/:id/cards', (req, res) => {
    const { id } = req.params;
    const cards = db.prepare('SELECT * FROM cards WHERE deck_id = ?').all(id);
    res.json(cards);
});

app.post('/api/cards', (req, res) => {
    const { deck_id, question, answer } = req.body;
    const result = db.prepare('INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)').run(deck_id, question, answer);
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);
    res.json(card);
});

app.delete('/api/cards/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    res.json( { success: true } );
});

// === DUNGEONS API ===

app.get('/api/dungeons/:user_id', (req, res) => {
    const { user_id } = req.params;
    const dungeons = db.prepare('SELECT * FROM dungeons WHERE user_id = ?').all(user_id);
    res.json(dungeons);
});

app.post('/api/dungeons', (req, res) => {
    const { user_id, name, deck_ids } = req.body;
    const result = db.prepare('INSERT INTO dungeons (user_id, name) VALUES (?, ?)').run(user_id, name);
    deck_ids.forEach(deck_id => {
        db.prepare('INSERT INTO dungeon_decks (dungeon_id, deck_id) VALUES (?, ?)').run(result.lastInsertRowid, deck_id);
    });
    const dungeon = db.prepare('SELECT * FROM dungeons WHERE id = ?').get(result.lastInsertRowid);
    res.json(dungeon);
});

app.delete('/api/dungeons/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM dungeons WHERE id = ?').run(id);
    res.json( { success: true } );
});