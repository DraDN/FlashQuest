const express = require('express');
const router = express.Router();

const { body, param } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const authHandler = require('../middleware/authHandler');
router.use(authHandler);

const decksService = require('../services/decksService');

router.get('/', authHandler, async (req, res) => {
    const decks = await decksService.getUserDecks(req.user_id);
    return res.status(200).json(decks);
});

router.post('/', [
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksService.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], validationHandler, async (req, res, next) => {
    const { name } = req.body;

    try {
        const deck = await decksService.addDeck(req.user_id, name);

        return res.status(200).json(deck);
    } catch (error) {
        next(error);
    }
});

// TODO: VALIDATE ID FOR EVERY ID RELATED ENDPOINT
router.post('/:id/rename', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number'),
    body('name')
        .trim()
        .notEmpty().withMessage('\'name\' is required')
        .isLength({ max: decksService.DECK_MAX_CHARACTERS }).withMessage('\'name\' too long')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const renamed_deck = await decksService.renameDeck(id, name, req.user_id);

        return res.status(200).json(renamed_deck);
    } catch (error) {
        next(error);
    }
});

// TODO limit possible deck number
// TOOO FIX if this fails, account level still gets updated!!!
router.post('/level-up', async (req, res, next) => {
    const { decks } = req.body;

    try {
        await decksService.addDecksLevelXP(decks || [], req.user_id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isNumeric().withMessage('\'id\' must be a number')
], async (req, res, next) => {
    const { id } = req.params;

    try {
        await decksService.deleteDeck(id, req.user_id);
        return res.status(204).send();
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
        const cards = await decksService.getDeckCards(id, req.user_id);

        return res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
