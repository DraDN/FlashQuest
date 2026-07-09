const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

const { body, validationResult } = require('express-validator');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});

const CARD_MAX_CHARACTERS = 100;
const DECK_MAX_CHARACTERS = 50;
const DUNGEON_MAX_CHARACTERS = 50;

// === ACCOUNT API ===

app.get('/api/check-status', (req, res) => {
    const { user_id } = req.query;

    const found = db.prepare('SELECT 1 FROM user_levels WHERE user_id = ?').get(user_id);
    if (!found) {
        db.prepare('INSERT INTO user_levels (user_id, level) VALUES (?, ?)').run(user_id, 0);
        return res.status(200).json( { new: true } );
    }

    return res.status(200).json( { new: false } );
})

app.get('/api/level-account', (req, res) => {
    const { user_id } = req.query;

    const level = db.prepare('SELECT * FROM user_levels WHERE user_id = ?').get(user_id);
    if (!level) {
        return res.status(404).json({ errors: 'User ID not found' });
    }

    return res.status(200).json(level);
})

app.post('/api/level-account', [
    body('level')
        .notEmpty().withMessage('\'level\' is required')
        .isInt({ min: 0 }).withMessage('\'level\' must a positive integer')
        .toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, level } = req.body;

    const found = db.prepare('SELECT level FROM user_levels WHERE user_id = ?').get(user_id);
    if (!found) {
        return res.status(404).json({ errors: 'User ID not found' });
    }

    const result = db.prepare('UPDATE user_levels SET level = ? WHERE user_id = ?').run(level, user_id);
    const new_level = db.prepare('SELECT 1 FROM user_levels WHERE user_id = ?').get(user_id);

    return res.status(200).json(new_level);
});

app.post('/api/level-up-account', [
    body('added_levels')
        .notEmpty().withMessage('\'added_levels\' is required')
        .isInt({ min: 0 }).withMessage('\'added_levels\' must a positive integer')
        .toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, added_levels } = req.body;

    const found = db.prepare('SELECT level FROM user_levels WHERE user_id = ?').get(user_id);
    if (!found) {
        return res.status(404).json({ errors: 'User ID not found' });
    }

    const result = db.prepare('UPDATE user_levels SET level = level + ? WHERE user_id = ?').run(added_levels, user_id);
    const new_level = db.prepare('SELECT 1 FROM user_levels WHERE user_id = ?').get(user_id);

    return res.status(200).json(new_level);
});

// === DECKS API ===

app.get('/api/decks', (req, res) => {
    const { user_id } = req.query;
    const decks = db.prepare('SELECT * FROM decks WHERE user_id = ?').all(user_id);
    return res.status(200).json(decks);
});

app.post('/api/decks', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name } = req.body;

    const result = db.prepare('INSERT INTO decks (user_id, name) VALUES (?, ?)').run(user_id, name);
    const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(result.lastInsertRowid);

    return res.status(200).json(deck);
});

app.post('/api/decks/:id/rename', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    const result = db.prepare('UPDATE decks SET name = ? WHERE id = ?').run(name, id);

    if (result.changes === 0) {
        return res.status(400).json({ errors: 'ID not found' });
    }

    const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(id);
    return res.status(200).json(deck)
});

// TODO limit possible deck number
// TOOO FIX if this fails, account level still gets updated!!!
const updateDeckLevelStmt = db.prepare('UPDATE decks SET xp = ?, level = ? WHERE id = ?');
app.post('/api/decks/sync-xp', (req, res) => {
    const { decks } = req.body;

    try {
        const syncDeckLevels = db.transaction((newDecks) => {
            for (const newDeck of newDecks) {
                if (updateDeckLevelStmt.run(newDeck.xp, newDeck.level, newDeck.id).changes === 0) {
                    throw new Error(`Deck ID ${newDeck.id} not found`);
                }
            }
        });

        syncDeckLevels(decks || []);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
})

app.delete('/api/decks/:id', (req, res) => {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM decks WHERE id = ?').run(id);
    return res.status(204).send();
});

// === CARDS API ===

app.get('/api/decks/:id/cards', (req, res) => {
    const { id } = req.params;

    const found = db.prepare('SELECT 1 FROM decks WHERE id = ?').get(id);
    if (!found) {
        return res.status(404).json({ errors: 'ID not found'});
    }

    const cards = db.prepare('SELECT * FROM cards WHERE deck_id = ?').all(id);
    return res.status(200).json(cards);
});

app.post('/api/cards', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { deck_id, question, answer } = req.body;

    const found = db.prepare('SELECT * FROM decks WHERE id = ?').get(deck_id);
    if (!found) {
        return res.status(404).json({ errors: 'Deck ID not found' });
    }

    const result = db.prepare('INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)').run(deck_id, question, answer);
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(result.lastInsertRowid);

    return res.status(200).json(card);
});

app.post('/api/cards/:id/edit', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question, answer } = req.body;

    const result = db.prepare('UPDATE cards SET question = ?, answer = ? WHERE id = ?').run(question, answer, id);

    if (result.changes === 0) {
        return res.status(404).json({ errors: 'Card ID not found' });
    }

    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    return res.status(200).json(card);
});

app.delete('/api/cards/:id', (req, res) => {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM cards WHERE id = ?').run(id);

    if (result.changes === 0) {
        return res.status(404).json({ errors: 'Card ID not found' });
    }

    return res.status(204).send();
});

// === DUNGEONS API ===

app.get('/api/dungeons', (req, res) => {
    const { user_id } = req.query;
    const dungeons = db.prepare('SELECT * FROM dungeons WHERE user_id = ?').all(user_id);
    return res.status(200).json(dungeons);
});

app.get('/api/dungeons/:id/decks', (req, res) => {
    const { id } = req.params;

    const found = db.prepare('SELECT 1 FROM dungeons WHERE id = ?').get(id);
    if (!found) {
        return res.status(404).json({ errors: 'Dungeon ID not found' });
    }

    const decks = db.prepare('SELECT * FROM decks WHERE id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)').all(id);

    return res.status(200).json(decks);
});

app.get('/api/dungeons/:id/cards', (req, res) => {
    const { id } = req.params;

    const found = db.prepare('SELECT * FROM dungeons WHERE id = ?').get(id);
    if (!found) {
        return res.status(404).json({ errors: 'Dungeon ID not found' });
    }

    const cards = db.prepare('SELECT * FROM cards WHERE deck_id IN (SELECT deck_id FROM dungeon_decks WHERE dungeon_id = ?)').all(id);

    return res.status(200).json(cards);
});

// TODO precompile statements for all routes
const checkDeckExistsStmt = db.prepare('SELECT 1 FROM decks WHERE id = ?');
const insertDungeonStmt = db.prepare('INSERT INTO dungeons (user_id, name) VALUES (?, ?)');
const insertDungeonDeckStmt = db.prepare('INSERT INTO dungeon_decks (dungeon_id, deck_id) VALUES (?, ?)');
const getDungeonStmt = db.prepare('SELECT * FROM dungeons WHERE id = ?');

// TODO add deck number limiting
app.post('/api/dungeons', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name, deck_ids } = req.body;

    try {
        const createDungeon = db.transaction((userId, dungeonName, deckIds) => {
            for (const deckId of deckIds) {
                const deck_exists = checkDeckExistsStmt.get(deckId);
                if (!deck_exists) {
                    throw new Error(`Deck ID ${deckId} not found`);
                }
            } 

            const result = insertDungeonStmt.run(userId, dungeonName);
            const dungeonId = result.lastInsertRowid;

            for (const deckId of deckIds) {
                insertDungeonDeckStmt.run(dungeonId, deckId);
            }

            return dungeonId;
        });

        const new_dungeon_id = createDungeon(user_id, name, deck_ids || []);

        const dungeon = getDungeonStmt.get(new_dungeon_id);
        return res.status(200).json(dungeon);
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
});

const updateDungeonNameStmt = db.prepare('UPDATE dungeons SET name = ? WHERE id = ?');
const deleteDungeonsDecksStmt = db.prepare('DELETE FROM dungeon_decks WHERE dungeon_id = ?');

app.post('/api/dungeons/:id/edit', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, deck_ids } = req.body;

    try {
        const updateDungeon = db.transaction((dungeonId, newDungeonName, deckIds) => {
            for (const deckId of deckIds) {
                if (!checkDeckExistsStmt.get(deckId)) {
                    throw new Error(`Deck ID ${deckId} does not exist`);
                }
            }

            const result = updateDungeonNameStmt.run(newDungeonName, dungeonId);
            if (result.changes === 0) {
                throw new Error('DUNGEON_NOT_FOUND');
            }

            deleteDungeonsDecksStmt.run(dungeonId);
            for (const deckId of deckIds) {
                insertDungeonDeckStmt.run(dungeonId, deckId);
            }

            return getDungeonStmt.get(dungeonId);
        })

        const updatedDungeon = updateDungeon(id, name, deck_ids);

        return res.status(200).json(updatedDungeon);
    } catch (error) {
        if (error.message === 'DUNGEON_NOT_FOUND') {
            return res.status(404).json({ errors: 'Dungeon ID not found' });
        }

        return res.status(400).json({ errors: error.message });
    }
});

app.delete('/api/dungeons/:id', (req, res) => {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM dungeons WHERE id = ?').run(id);

    if (result.changes === 0) {
        return res.status(404).json({ errors: 'Dungeon ID not found' });
    }

    deleteDungeonsDecksStmt.run(id);

    return res.status(204).send();
});