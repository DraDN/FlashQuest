const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

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

router.post('/:id/edit', [
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
