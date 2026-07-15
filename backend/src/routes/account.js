const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const accountService = require('../services/accountService');

router.get('/check-status', async (req, res, next) => {
    const { user_id } = req.query;

    try {
        const is_new = await accountService.ensureAccountIsInitialized(user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        next(error);
    }  
});

router.get('/level', async (req, res, next) => {
    const { user_id } = req.query;

    try {
        const level = await accountService.getAccountLevel(user_id);

        return res.status(200).json(level);
    } catch (error) {
        next(error);
    }
});

router.post('/level-up', [
    body('level')
        .notEmpty().withMessage('\'level\' is required')
        .isInt({ min: 0 }).withMessage('\'level\' must be a positive integer')
        .toInt()
], validationHandler, async (req, res, next) => {
    const { user_id, level } = req.body;

    try {
        const updated_level = await accountService.setAccountLevel(user_id, level);

        return res.status(200).json(updated_level);
    } catch (error) {
        next(error);
    }
});

module.exports = router;