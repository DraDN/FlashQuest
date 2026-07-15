const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }

    console.error(`Uncaught Exception: ${err}`);
    return res.status(500).json({ error: 'Something went wrong on our end' });
}

module.exports = errorHandler;