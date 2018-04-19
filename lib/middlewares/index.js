'use strict';

/** @module middlewares */

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');

/**
 * Configures global middlewares on the given Express app.
 *
 * @param {express~Application} app - The express app.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {string[]} config.paths.public - Static content directories.
 *
 * @param {Object} config.session - Session configuration.
 * @param {string} config.session.secret - Secret used to sign cookies.
 * session store.
 * @param {string} config.session.storeFilePath - Path to persistent session
 * storage file.
 *
 * @returns {Promise} Resolves when the middlewares have been configured, or
 * rejects if an error occurred.
 */
module.exports = async function middlewares(app, config) {
    config.paths.public.forEach(dir => app.use(express.static(dir)));

    const store = new FileStore({
        path: config.session.storeFilePath
    });

    app.use(session({
        cookie: {
            httpOnly: false,
            secure: app.get('env') === 'production'     // only in production
        },
        resave: false,
        saveUninitialized: false,
        secret: config.session.secret,
        store
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    return void 0;
};

