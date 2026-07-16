const { AppError, ValidationError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        if (err instanceof ValidationError) {
            return res.status(err.status).json({ error: err.message, details: err.validationErrors });
        }

        return res.status(err.status).json({ error: err.message });
    }

    console.error(`Uncaught Exception: ${err}`);
    return res.status(500).json({ error: 'Something went wrong on our end' });
}

module.exports = errorHandler;