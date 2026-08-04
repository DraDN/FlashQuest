const { NotFoundError, ForbiddenError } = require('./errors');

const enforceOwnership = (owner_id, user_id, resource_name) => {
    if (!owner_id) {
        throw new NotFoundError(`${resource_name} not found`);
    }

    if (user_id !== owner_id) {
        throw new ForbiddenError();
    }
};

module.exports = {
    enforceOwnership
};