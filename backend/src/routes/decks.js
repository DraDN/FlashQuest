const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const decksService = require('../services/decksService');

router.get('/', async (req, res) => {
    const { user_id } = req.query;
    const decks = await decksService.getUserDecks(user_id);
    return res.status(200).json(decks);
});

router.post('/', [
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

router.post('/:id/rename', [
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
router.post('/sync-xp', async (req, res) => {
    const { decks } = req.body;

    try {
        await decksService.setDecksLevelXP(decks || []);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await decksService.deleteDeck(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ errors: 'Internal server error' });
    }
});

router.get('/:id/cards', async (req, res) => {
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

module.exports = router;
