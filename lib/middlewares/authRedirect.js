'use strict';

/** @module middlewares/authRedirect */

/**
 * Creates a middleware that checks if the user is authenticated; if not, the
 * user is redirected to the given URL.
 *
 * @param {string} url - The URL to redirect to, in case the user is not
 * authenticated.
 * @returns {external:express~Middleware} The middleware.
 */
module.exports = function authRedirect(url) {
    return function(req, res, done) {
        if (req.isAuthenticated()) {
            return done();
        }

        res.redirect(url);
    };
};

