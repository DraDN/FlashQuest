const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./db');

const { body, validationResult } = require('express-validator');

const accountService = require('./services/accountService');
const decksService = require('./services/decksService');
const cardsService = require('./services/cardsService');
const dungeonsService = require('./services/dungeonsService');

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Backend running on port 3000');
});

// === ACCOUNT API ===

app.get('/api/check-status', async (req, res) => {
    const { user_id } = req.query;

    try {
        const is_new = await accountService.ensureAccountIsInitialized(user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        if (error.message === 'FAIL') {
            return res.status(500).json({ error: 'Couldn\'t insert user into level records' });
        }

        return res.status(500).json({ error: `Internal server error - ${error.message}` });
    }
})

app.get('/api/level-account', async (req, res) => {
    const { user_id } = req.query;

    try {
        const level = await accountService.getAccountLevel(user_id);

        return res.status(200).json(level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'User ID not found' });
        }

        return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
})

app.post('/api/level-account', [
    body('level')
        .notEmpty().withMessage('\'level\' is required')
        .isInt({ min: 0 }).withMessage('\'level\' must be a positive integer')
        .toInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, level } = req.body;

    try {
        const updated_level = await accountService.setAccountLevel(user_id, level);

        return res.status(200).json(updated_level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'User ID not found' });
        } else if (error.message === 'FAIL') {
            return res.status(500).json({ error: 'Couldn\'t update user level' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/level-up-account', [
    body('added_levels')
        .notEmpty().withMessage('\'added_levels\' is required')
        .isInt({ min: 0 }).withMessage('\'added_levels\' must a positive integer')
        .toInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, added_levels } = req.body;

    try {
        const new_level = await accountService.addAccountLevels(user_id, added_levels);

        return res.status(200).json(new_level);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'User ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

// === DECKS API ===

app.get('/api/decks', async (req, res) => {
    const { user_id } = req.query;
    const decks = await decksService.getUserDecks(user_id);
    return res.status(200).json(decks);
});

app.post('/api/decks', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksService.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name } = req.body;

    try {
        const deck = await decksService.addDeck(user_id, name);

        return res.status(200).json(deck);
    } catch (error) {
        return res.status(500).json({ errors: 'Internal server error' });
    }
});

app.post('/api/decks/:id/rename', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksService.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    try {
        const renamed_deck = await decksService.renameDeck(id, name);

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
app.post('/api/decks/sync-xp', async (req, res) => {
    const { decks } = req.body;

    try {
        await decksService.setDecksLevelXP(decks || []);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
})

app.delete('/api/decks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await decksService.deleteDeck(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ errors: 'Internal server error' });
    }
});

// === CARDS API ===

app.get('/api/decks/:id/cards', async (req, res) => {
    const { id } = req.params;

    try {
        const cards = await decksService.getDeckCards(id);

        return res.status(200).json(cards);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Deck ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/cards', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { deck_id, question, answer } = req.body;

    try {
        const card = await cardsService.addCard(deck_id, question, answer);

        return res.status(200).json(card);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            res.status(404).json({ error: 'Deck ID not found' });
        }

        return res.status(500).json({ error: `Internal server error - ${error.message}` });
    }

});

app.post('/api/cards/:id/edit', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { question, answer } = req.body;

    try {
        const card = await cardsService.editCard(id, question, answer);

        return res.status(200).json(card);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            res.status(404).json({ error: 'Card ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cards/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await cardsService.deleteCard(id);

        return res.status(204).send();
    } catch (errors) {
        if (error.message === 'NOT_FOUND') {
            res.status(404).json({ error: 'Card ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    } 
});

// === DUNGEONS API ===

app.get('/api/dungeons', async (req, res) => {
    const { user_id } = req.query;
    const dungeons = await dungeonsService.getUserDungeons(user_id);
    return res.status(200).json(dungeons);
});

app.get('/api/dungeons/:id/decks', async (req, res) => {
    const { id } = req.params;

    try {
        const decks = await dungeonsService.getDungeonDecks(id);

        return res.status(200).json(decks);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'Dungeon ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/dungeons/:id/cards', async (req, res) => {
    const { id } = req.params;

    try {
        const cards = await dungeonsService.getDungeonCards(id);

        return res.status(200).json(cards);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'Dungeon ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

// TODO add deck number limiting
app.post('/api/dungeons', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, name, deck_ids } = req.body;

    try {
        const dungeon = await dungeonsService.addDungeon(user_id, name, deck_ids);

        return res.status(200).json(dungeon);
    } catch (error) {
        return res.status(400).json({ errors: error.message }); // TOOD FIX ERRORS
    }
});

app.post('/api/dungeons/:id/edit', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, deck_ids } = req.body;

    try {
        const updatedDungeon = await dungeonsService.editDungeon(id, name, deck_ids);
        return res.status(200).json(updatedDungeon);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'Dungeon ID not found' });
        }

        return res.status(400).json({ errors: error.message });
    }
});

app.delete('/api/dungeons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await dungeonsService.deleteDungeon(id);

        return res.status(204).send();
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ errors: 'Dungeon ID not found' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});