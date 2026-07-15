const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const dungeonsService = require('../services/dungeonsService');

router.get('/', async (req, res) => {
    const { user_id } = req.query;
    const dungeons = await dungeonsService.getUserDungeons(user_id);
    return res.status(200).json(dungeons);
});

router.get('/:id/decks', async (req, res) => {
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

router.get('/:id/cards', async (req, res) => {
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
router.post('/', [
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

router.post('/:id/edit', [
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
