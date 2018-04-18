'use strict';

/** @module middlewares/authRedirect */

/**
 * Creates a middleware that checks if the user is authenticated; if not, the
 * user is redirected to the given URL with `status`.
 *
 * @param {string} url - The URL to redirect to, in case the user is not
 * authenticated.
 * @param {number} [status=401] Status code for the redirect.
 * @returns {external:express~Middleware} The middleware.
 */
module.exports = function authRedirect(url, status = 401) {
    return function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect(status, url);
    };
};

