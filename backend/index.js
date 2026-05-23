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

// === ACCOUNT LEVEL ===

app.get('/api/level-account', (req, res) => {
    const { user_id } = req.query;
    const level = db.prepare('SELECT level FROM user_levels WHERE user_id = ?').get(user_id);
    if (!level) {
        db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, ?)').run(user_id, 0);
        res.json( { level: 0 } );
    } else {
        res.json(level);
    }
})

app.post('/api/level-account', (req, res) => {
    const { user_id, level } = req.body;
    const exist = db.prepare('SELECT level FROM user_levels WHERE user_id = ?').get(user_id);
    if (!exist) {
        db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, ?)').run(user_id, level);
    } else {
        db.prepare('UPDATE user_levels SET level = ? WHERE user_id = ?').run(level, user_id);
    }
    res.json( { success: true } );
});

app.post('/api/level-up-account', (req, res) => {
    const { user_id, added_levels } = req.body;
    const exist = db.prepare('SELECT level FROM user_levels WHERE user_id = ?').get(user_id);
    if (!exist) {
        db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, ?)').run(user_id, added_levels);
    } else {
        db.prepare('UPDATE user_levels SET level = level + ? WHERE user_id = ?').run(added_levels, user_id);
    }
    res.json( { success: true } );
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

app.post('/api/decks/:id/rename', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    db.prepare('UPDATE decks SET name = ? WHERE id = ?').run(name, id);
    const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(id);
    res.json(deck)
});

app.post('/api/decks/sync-xp', (req, res) => {
    const { decks } = req.body;
    decks.forEach(({ id, xp, level }) => {
        db.prepare('UPDATE decks SET xp = ?, level = ? WHERE id = ?').run(xp, level, id);
    });
    res.json({ success: true });
})

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

app.post('/api/cards/:id/edit', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    db.prepare('UPDATE cards SET question = ?, answer = ? WHERE id = ?').run(question, answer, id);
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    res.json(card);
});

app.delete('/api/cards/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    res.json( { success: true } );
});

// === DUNGEONS API ===

app.get('/api/dungeons', (req, res) => {
    const { user_id } = req.query;
    const dungeons = db.prepare('SELECT * FROM dungeons WHERE user_id = ?').all(user_id);
    res.json(dungeons);
});

app.get('/api/dungeons/:id/decks', (req, res) => {
    const { id } = req.params;
    const decks = db.prepare('SELECT * FROM decks WHERE id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)').all(id);
    res.json(decks);
});

app.get('/api/dungeons/:id/cards', (req, res) => {
    const { id } = req.params;
    const cards = db.prepare('SELECT * FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)').all(id);
    res.json(cards);
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

app.post('/api/dungeons/:id/edit', (req, res) => {
    const { id } = req.params;
    const { name, deck_ids } = req.body;
    db.prepare('UPDATE dungeons SET name = ? WHERE id = ?').run(name, id);
    db.prepare('DELETE FROM dungeon_decks WHERE dungeon_id = ?').run(id);
    deck_ids.forEach(deck_id => {
        db.prepare('INSERT INTO dungeon_decks (dungeon_id, deck_id) VALUES (?, ?)').run(id, deck_id);
    })
    const dungeon = db.prepare('SELECT * FROM dungeons WHERE id = ?').get(id);
    res.json(dungeon);
});

app.delete('/api/dungeons/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM dungeons WHERE id = ?').run(id);
    res.json( { success: true } );
});