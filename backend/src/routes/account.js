const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const authHandler = require('../middleware/authHandler');
router.use(authHandler);

const accountService = require('../services/accountService');

router.get('/check-status', async (req, res, next) => {
    try {
        const is_new = await accountService.ensureAccountIsInitialized(req.user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        next(error);
    }  
});

router.get('/level', async (req, res, next) => {
    try {
        const level = await accountService.getAccountLevel(req.user_id);

        return res.status(200).json(level);
    } catch (error) {
        next(error);
    }
});

router.post('/level', async (req, res, next) => {
    const { level } = req.body;

    try {
        const updated_level = await accountService.setAccountLevel(req.user_id, level);

        return res.status(200).json(updated_level);
    } catch (error) {
        next(error);
    }
});

router.post('/level-up', [
    body('added_levels')
        .notEmpty().withMessage('\'added_levels\' is required')
        .isInt({ min: 0 }).withMessage('\'added_levels\' must be a positive integer')
        .toInt()
], validationHandler, async (req, res, next) => {
    const { added_levels } = req.body;

    try {
        const updated_level = await accountService.addAccountLevels(req.user_id, added_levels);

        return res.status(200).json(updated_level);
    } catch (error) {
        next(error);
    }
});

module.exports = router;