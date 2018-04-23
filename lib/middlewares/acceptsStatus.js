'use strict';

/** @module middlewares/acceptsStatus */

/**
 * Creates a middleware that checks if the given content type(s) are accepted;
 * if not, a status response is generated.
 *
 * @param {(string|string[])} types - Content type(s).
 * @param {number} [status=406] - Status to generate.
 * @returns {Function} The middleware.
 */
module.exports = function acceptsStatus(types, status = 406) {
    return function(req, res, next) {
        if (req.accepts(types)) {
            return next();
        }

        res.sendStatus(status).end();
    };
};

