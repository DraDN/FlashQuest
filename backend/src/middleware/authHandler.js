const { getAuth } = require('@clerk/express');

const { UnauthError } = require('../utils/errors');

const authHandler = (req, res, next) => {
    try {
        const isLocalDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const devUserIDOverride = req.headers['x-dev-user-id'];

        if (isLocalDev && devUserIDOverride) {
            console.log('Using dev user ID override: ', devUserIDOverride);
            req.user_id = devUserIDOverride;
            return next();
        }

        const { isAuthenticated, userId } = getAuth(req);

        if (!isAuthenticated || !userId) {
            throw new UnauthError('User is not authenticated');
        }

        req.user_id = userId;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authHandler;