const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

const { body, validationResult } = require('express-validator');

const accountRepo = require('./repositories/accountRepository')
const decksRepo = require('./repositories/decksRepository');
const cardsRepo = require('./repositories/cardsRepository');
const dungeonsRepo = require('./repositories/dungeonsRepository');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});

// === ACCOUNT API ===

app.get('/api/check-status', (req, res) => {
    const { user_id } = req.query;

    try {
        const is_new = accountRepo.checkAccountStatus(user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        if (error.message === 'FAIL') {
            return res.status(500).json({ error: 'Couldn\'t insert user into level records' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/api/level-account', (req, res) => {
    const { user_id } = req.query;

    try {
        const level = accountRepo.getUserLevel(user_id);

        return res.status(200).json(level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'User ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/level-account', [
    body('level')
        .notEmpty().withMessage('\'level\' is required')
        .isInt({ min: 0 }).withMessage('\'level\' must be a positive integer')
        .toInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, level } = req.body;

    try {
        const updated_level = accountRepo.setUserLevel(user_id, level);

        return res.status(200).json(updated_level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'User ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
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

    try {
        const new_level = accountRepo.addUserLevels(user_id, added_levels);

        return res.status(200).json(new_level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'User ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

// === DECKS API ===

app.get('/api/decks', (req, res) => {
    const { user_id } = req.query;
    const decks = decksRepo.getUserDecks(user_id);
    return res.status(200).json(decks);
});

app.post('/api/decks', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksRepo.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name } = req.body;

    try {
        const deck = decksRepo.addDeck(user_id, name);

        return res.status(200).json(deck);
    } catch (error) {
        return res.status(500).json({ errors: 'Internal server error' });
    }
});

app.post('/api/decks/:id/rename', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksRepo.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    try {
        const renamed_deck = decksRepo.renameDeck(id, name);

        return res.status(200).json(renamed_deck);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(400).json({ errors: 'Deck ID not found' });
        }

        return res.status(500).json({ errors: 'Internal server error' });
    }
});

// TODO limit possible deck number
// TOOO FIX if this fails, account level still gets updated!!!
app.post('/api/decks/sync-xp', (req, res) => {
    const { decks } = req.body;

    try {
        decksRepo.setDecksLevelXP(decks || []);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
})

app.delete('/api/decks/:id', (req, res) => {
    const { id } = req.params;

    try {
        const result = decksRepo.deleteDeck(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ errors: 'Internal server error' });
    }
});

// === CARDS API ===

app.get('/api/decks/:id/cards', (req, res) => {
    const { id } = req.params;

    const found = decksRepo.checkDeckExists(id);
    if (!found) {
        return res.status(404).json({ errors: 'Deck ID not found'});
    }

    const cards = cardsRepo.getCardsOfDeck(id);
    return res.status(200).json(cards);
});

app.post('/api/cards', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsRepo.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsRepo.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { deck_id, question, answer } = req.body;

    const found = decksRepo.checkDeckExists(id);
    if (!found) {
        return res.status(404).json({ errors: 'Deck ID not found' });
    }

    const result = cardsRepo.addCard(deck_id, question, answer);
    const card = cardsRepo.getCardByID(resutl.lastInsertRowid);

    return res.status(200).json(card);
});

app.post('/api/cards/:id/edit', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsRepo.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsRepo.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question, answer } = req.body;

    const result = cardsRepo.editCard(id, question, answer);
    if (result.changes === 0) {
        return res.status(404).json({ errors: 'Card ID not found' });
    }

    const card = cardsRepo.getCardByID(id);
    return res.status(200).json(card);
});

app.delete('/api/cards/:id', (req, res) => {
    const { id } = req.params;

    const result = cardsRepo.deleteCard(id);
    if (result.changes === 0) {
        return res.status(404).json({ errors: 'Card ID not found' });
    }

    return res.status(204).send();
});

// === DUNGEONS API ===

app.get('/api/dungeons', (req, res) => {
    const { user_id } = req.query;
    const dungeons = dungeonsRepo.getUserDungeons(user_id);
    return res.status(200).json(dungeons);
});

app.get('/api/dungeons/:id/decks', (req, res) => {
    const { id } = req.params;

    const found = dungeonsRepo.checkDungeonExists(id);
    if (!found) {
        return res.status(404).json({ errors: 'Dungeon ID not found' });
    }

    const decks = decksRepo.getDecksOfDungeon(id);

    return res.status(200).json(decks);
});

app.get('/api/dungeons/:id/cards', (req, res) => {
    const { id } = req.params;

    const found = dungeonsRepo.checkDungeonExists(id);
    if (!found) {
        return res.status(404).json({ errors: 'Dungeon ID not found' });
    }

    const cards = cardsRepo.getCardsOfDungeon(id);

    return res.status(200).json(cards);
});

// TODO add deck number limiting
app.post('/api/dungeons', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsRepo.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name, deck_ids } = req.body;

    try {
        const dungeon = dungeonsRepo.addDungeon(user_id, name, deck_ids);
        return res.status(200).json(dungeon);
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
});

app.post('/api/dungeons/:id/edit', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsRepo.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, deck_ids } = req.body;

    try {
        const updatedDungeon = dungeonsRepo.editDungeon(id, name, deck_ids);
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

    return res.status(204).send();
});