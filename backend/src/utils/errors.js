class AppError extends Error {
    constructor(status, message) {
        super(message);

        this.status = status;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
};

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
    }
};

class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(400, message);
    }
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError
};