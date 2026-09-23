const express = require('express');
const router = express.Router();

const { body } = require('express-validator');
const validationHandler = require('../middleware/validationHandler');

const authHandler = require('../middleware/authHandler');
router.use(authHandler);

const accountService = require('../services/accountService');

router.get('/check-init', async (req, res, next) => {
    try {
        const is_new = await accountService.ensureAccountIsInitialized(req.user_id);

        return res.status(200).json({ new: is_new });
    } catch (error) {
        next(error);
    }  
});

router.get('/coins', async (req, res, next) => {
    try {
        const coins = await accountService.getAccountCoins(req.user_id);

        return res.status(200).json(coins);
    } catch (error) {
        next(error);
    }
});

router.post('/coins', async (req, res, next) => {
    const { coins } = req.body;

    try {
        const updated_coins = await accountService.setAccountCoins(req.user_id, coins);

        return res.status(200).json(updated_coins);
    } catch (error) {
        next(error);
    }
});

router.post('/earn', [
    body('added_coins')
        .notEmpty().withMessage('\'added_coins\' is required')
        .isInt({ min: 0 }).withMessage('\'added_coins\' must be a positive integer')
        .toInt()
], validationHandler, async (req, res, next) => {
    const { added_coins } = req.body;

    try {
        const updated_coins = await accountService.addAccountCoins(req.user_id, added_coins);

        return res.status(200).json(updated_coins);
    } catch (error) {
        next(error);
    }
});

module.exports = router;