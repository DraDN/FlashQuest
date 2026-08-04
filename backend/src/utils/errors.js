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
    constructor(validationErrorsArray) {
        super(400, "Validation Error");

        this.validationErrors = validationErrorsArray;
    }
};

class UnauthError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
};

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthError,
    ForbiddenError
};