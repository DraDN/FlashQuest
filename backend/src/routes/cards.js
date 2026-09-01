const express = require('express');
const router = express.Router();

const { body, param, check } = require('express-validator');
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
        .isInt({ min: 0, max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answer\' must be an integer between 0 and ' + cardsService.CARD_MAX_OPTIONS),
    body('options')
        .trim()
        .notEmpty().withMessage('\'options\' is required')
        .isArray({ max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'options\' must be an array of max size ' + cardsService.CARD_MAX_OPTIONS),
    check(`options.*`)
        .trim()
        .notEmpty().withMessage('Passed \'options\' empty')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('Passed \'options\' too long')
], validationHandler, async (req, res, next) => {
    const { deck_id, question, answer, options } = req.body;

    try {
        const card = await cardsService.addCard(deck_id, question, answer, options, req.user_id);

        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isInt({ min: 0 }).withMessage('\'id\' must be an integer greater than 0'),
    body('question')
        .trim()
        .notEmpty().withMessage('\'question\' is required')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('\'question\' too long'),
    body('answer')
        .trim()
        .notEmpty().withMessage('\'answer\' is required')
        .isInt({ min: 0, max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answer\' must be an integer between 0 and ' + cardsService.CARD_MAX_OPTIONS),
    body('options')
        .trim()
        .notEmpty().withMessage('\'options\' is required')
        .isArray({ max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'options\' must be an array of max size ' + cardsService.CARD_MAX_OPTIONS),
    check(`options.*`)
        .trim()
        .notEmpty().withMessage('Passed \'options\' empty')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('Passed \'options\' too long')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;
    const { question, answer, options } = req.body;

    try {
        const card = await cardsService.editCard(id, question, answer, options, req.user_id);

        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', [
    param('id')
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isInt({ min: 0 }).withMessage('\'id\' must be an integer greater than 0')
], validationHandler, async (req, res, next) => {
    const { id } = req.params;

    try {
        await cardsService.deleteCard(id, req.user_id);

        return res.status(204).send();
    } catch (errors) {
        next(errors);
    } 
});

module.exports = router;
