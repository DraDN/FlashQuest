const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const authHandler = require('../middleware/authHandler');
router.use(authHandler);

const cardsService = require('../services/cardsService');

router.post('/', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], validationHandler, async (req, res, next) => {
    const { deck_id, question, answer } = req.body;

    try {
        const card = await cardsService.addCard(deck_id, question, answer, req.user_id);

        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit', [
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'answer\' too long')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    try {
        const card = await cardsService.editCard(id, question, answer, req.user_id);

        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        await cardsService.deleteCard(id, req.user_id);

        return res.status(204).send();
    } catch (errors) {
        next(errors);
    } 
});

module.exports = router;
