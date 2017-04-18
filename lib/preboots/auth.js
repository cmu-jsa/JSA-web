'use strict';

/** @module preboots/auth */

const url = require('url');
const passport = require('passport');

const User = require('../models/user');

/**
 * Configures authentication settings for the given Express app.
 *
 * @private
 * @param {external:express~Application} app - The Express app to configure.
 * @param {Object} config - Configuration options.
 *
 * @param {string} config.protocol - The server's protocol.
 * @param {string} config.hostname - The server's hostname.
 * @param {number} config.port - The server's listening port.
 *
 * @param {string} config.auth.clientID - The Google OAuth client ID.
 * @param {string} config.auth.clientSecret - The Google OAuth client secret.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {Object} config.paths.auth - Authentication-related paths.
 * @param {string} config.paths.auth.index - Base path for authentication
 * endpoints.
 * @param {string} config.paths.auth.callback - Auth callback path.
 *
 * @returns {Promise} Resolves when authentication has been configured, or
 * rejects if an error occurred.
 */
module.exports = function auth(app, config) {
    app.use(passport.initialize());
    app.use(passport.session());

    const {
        protocol,
        hostname,
        port,
        paths,
        auth: {
            clientID,
            clientSecret
        }
    } = config;

    // Set up passport
    const callbackURL = url.format({
        protocol, hostname, port,
        pathname: paths.auth.index + paths.auth.callback
    });
    passport.use(User.createStrategy(clientID, clientSecret, callbackURL));

    return Promise.resolve();
};

