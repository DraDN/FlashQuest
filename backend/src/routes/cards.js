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
    body('answers')
        .isArray({ max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answers\' must be an array of max size ' + cardsService.CARD_MAX_OPTIONS),
    check(`answers.*`)
        .isInt({ min: 0, max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answers\' must be an array of integers between 0 and ' + cardsService.CARD_MAX_OPTIONS -1),
    body('options')
        .trim()
        .notEmpty().withMessage('\'options\' is required')
        .isArray({ max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'options\' must be an array of max size ' + cardsService.CARD_MAX_OPTIONS),
    check(`options.*`)
        .trim()
        .notEmpty().withMessage('Passed \'options\' empty')
        .isLength({ max: cardsService.CARD_MAX_CHARACTERS }).withMessage('Passed \'options\' too long')
], validationHandler, async (req, res, next) => {
    const { deck_id, question, answers, options } = req.body;

    try {
        const card = await cardsService.addCard(deck_id, question, answers, options, req.user_id);

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
    body('answers')
        .isArray({ max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answers\' must be an array of max size ' + cardsService.CARD_MAX_OPTIONS),
    check(`answers.*`)
        .isInt({ min: 0, max: cardsService.CARD_MAX_OPTIONS }).withMessage('\'answers\' must be an array of integers between 0 and ' + cardsService.CARD_MAX_OPTIONS -1),
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
    const { question, answers, options } = req.body;

    try {
        const card = await cardsService.editCard(id, question, answers, options, req.user_id);

        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
});

router.post('/grade', [
    body('grades')
        .isArray({ min: 1 }).withMessage('\'grades\' must be an array of minimum size 1'),
    check(`grades.*.id`)
        .trim()
        .notEmpty().withMessage('\'id\' is required')
        .isInt({ min: 0 }).withMessage('\'id\' must be an integer greater than 0'),
    check(`grades.*.grade`)
        .isNumeric({ min: 0, max: 3 }).withMessage('\'grade\' must be a number greater than 0 and less than 4')
], validationHandler, async (req, res, next) => {
    const { grades } = req.body;

    try {
        const resp = await cardsService.gradeCards(grades, req.user_id);

        return res.status(204);
    } catch (error) {
        next(error);
    }
})

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
