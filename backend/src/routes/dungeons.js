const express = require('express');
const router = express.Router();

const { body, param } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const dungeonsService = require('../services/dungeonsService');

const authHandler = require('../middleware/authHandler');
router.use(authHandler);

router.get('/', async (req, res) => {
    const dungeons = await dungeonsService.getUserDungeons(req.user_id);
    return res.status(200).json(dungeons);
});

router.get('/:id/decks', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number')
], async (req, res, next) => {
    const { id } = req.params;

    try {
        const decks = await dungeonsService.getDungeonDecks(id, req.user_id);

        return res.status(200).json(decks);
    } catch (error) {
        next(error);
    }
});

router.get('/:id/cards', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number')
], async (req, res, next) => {
    const { id } = req.params;

    try {
        const cards = await dungeonsService.getDungeonCards(id, req.user_id);

        return res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
});

// TODO add deck number limiting
router.post('/', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], validationHandler, async (req, res, next) => {
    const { name, deck_ids } = req.body;

    try {
        const dungeon = await dungeonsService.addDungeon(req.user_id, name, deck_ids);

        return res.status(200).json(dungeon);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number'),
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: dungeonsService.DUNGEON_MAX_CHARACTERS }).withMessage('\'name\' is too long')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;
    const { name, deck_ids } = req.body;

    try {
        const updatedDungeon = await dungeonsService.editDungeon(id, name, deck_ids, req.user_id);
        return res.status(200).json(updatedDungeon);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number')
], async (req, res, next) => {
    const { id } = req.params;

    try {
        await dungeonsService.deleteDungeon(id, req.user_id);

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;
