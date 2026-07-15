const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const dungeonsService = require('../services/dungeonsService');

router.get('/', async (req, res) => {
    const { user_id } = req.query;
    const dungeons = await dungeonsService.getUserDungeons(user_id);
    return res.status(200).json(dungeons);
});

router.get('/:id/decks', async (req, res, next) => {
    const { id } = req.params;

    try {
        const decks = await dungeonsService.getDungeonDecks(id);

        return res.status(200).json(decks);
    } catch (error) {
        next(errors);
    }
});

router.get('/:id/cards', async (req, res, next) => {
    const { id } = req.params;

    try {
        const cards = await dungeonsService.getDungeonCards(id);

        return res.status(200).json(cards);
    } catch (error) {
        next(errors);
    }
});

// TODO add deck number limiting
router.post('/', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], validationHandler, async (req, res, next) => {
    const { user_id, name, deck_ids } = req.body;

    try {
        const dungeon = await dungeonsService.addDungeon(user_id, name, deck_ids);

        return res.status(200).json(dungeon);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;
    const { name, deck_ids } = req.body;

    try {
        const updatedDungeon = await dungeonsService.editDungeon(id, name, deck_ids);
        return res.status(200).json(updatedDungeon);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        await dungeonsService.deleteDungeon(id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
