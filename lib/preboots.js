'use strict';

/** @module preboots */

const passport = require('passport');
const LocalAuth = require('./LocalAuth');
const Elections = require('./Elections');

/**
 * Configures pre-boot settings for the given Express app.
 *
 * @param {external:express~Application} app - The Express app to configure.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.auth - Authentication configuration.
 * @param {string} config.auth.userFilePath - Path to username/password file for
 * use with `LocalAuth`.
 *
 * @returns {Promise} Resolves when pre-boot configuration has finished, or
 * rejects if an error occurred.
 */
module.exports = async function preboots(app, config) {
    app.elections = new Elections();
    app.localAuth = new LocalAuth(config.auth.userFilePath);
    passport.use(app.localAuth.strategy);
    passport.serializeUser(app.localAuth.serializeUser);
    passport.deserializeUser(app.localAuth.deserializeUser);

    return void 0;
};

