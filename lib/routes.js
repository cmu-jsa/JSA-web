'use strict';

/** @module routes */

const path = require('path');
const express = require('express');
const passport = require('passport');

const authRedirect = require('./middlewares/authRedirect');

/**
 * Configures routes for the given Express app.
 *
 * @private
 * @param {external:express~Application} app - The app to configure.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {Object} config.paths.public - Static public file directory.
 * @param {string} config.paths.loginUI - Login UI path.
 * @param {Object} config.paths.auth - Authentication-related paths.
 * @param {string} config.paths.auth.index - Base path for authentication
 * endpoints.
 * @param {string} config.paths.auth.login - Auth login path.
 * @param {string} config.paths.auth.callback - Auth callback path.
 * @param {string} config.paths.auth.logout - Auth logout path.
 *
 * @returns {Promise} Resolves when the routes have been configured, or rejects
 * if an error occurred.
 */
module.exports = function routes(app, config) {
    const { paths } = config;

    app.get('/secure', authRedirect(paths.loginUI), function(req, res) {
        res.end(req.user.googleID);
    });

    // Set up authentication endpoints
    const authRouter = new express.Router();
    authRouter.get(
        paths.auth.login,
        passport.authenticate('google')
    );
    authRouter.get(
        paths.auth.callback,
        passport.authenticate('google', {
            failureRedirect: paths.loginUI
        }),
        function(req, res) {
            res.redirect('/');
        }
    );
    authRouter.get(
        paths.auth.logout,
        function(req, res) {
            req.logout();
            res.redirect('/');
        }
    );
    app.use(paths.auth.index, authRouter);

    // Set up SPA fallback
    app.use(function(req, res) {
        res.sendFile(path.join(paths.public, 'index.html'));
    });

    return Promise.resolve();
};

