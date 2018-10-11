'use strict';

/** @module middlewares/authStatus */

/**
 * Creates a middleware that checks if the user is authenticated; if not, a
 * status response is generated.
 *
 * @param {string} [authLevel=-Infinity] The user's minimum authorization level.
 * @param {number} [status=401] Status to generate.
 * @returns {Function} The middleware.
 */
module.exports = function authStatus(authLevel = -Infinity, status = 401) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.authLevel >= authLevel) {
            return next();
        }

        res.set('Content-Type', 'text/plain')
            .status(status)
            .end();
    };
};

