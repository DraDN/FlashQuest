const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000,

    standardHeaders: 'draft-8',
    legacyHeaders: false,

    message: {
        status: 429,
        error: 'Too many requests. Please slow down and try again later.'
    }
});

module.exports = limiter;
