const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const accountService = require('../services/accountService');

router.get('/check-status', async (req, res) => {
    const { user_id } = req.query;

    try {
        const is_new = await accountService.ensureAccountIsInitialized(user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        if (error.message === 'FAIL') {
            return res.status(500).json({ error: 'Couldn\'t insert user into level records' });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }  
});

router.get('/level', async (req, res) => {
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
});

router.post('/level-up', [
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
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;