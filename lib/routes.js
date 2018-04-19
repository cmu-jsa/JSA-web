'use strict';

/** @module routes */

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

/**
 * Creates a middleware that attempts to serve the given file.
 *
 * @param {string} file The path to the file.
 * @param {Object} [opts={}] The options for `res.sendFile`.
 * @returns {Function} The middleware.
 */
function serveFile(file, opts = {}) {
    return (req, res, next) => {
        console.log(`serving ${file}`);
        res.sendFile(file, opts, err => {
            err && next(err);
        });
    };
}

/**
 * Configures routes for the given Express app.
 *
 * @private
 * @param {external:express~Application} app - The app to configure.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {string[]} config.paths.public - Static content directories.
 * @param {string} config.paths.loginUI - Login UI path.
 * @param {Object} config.paths.auth - Authentication-related paths.
 * @param {string} config.paths.auth.index - Base path for authentication
 * endpoints.
 * @param {string} config.paths.auth.login - Auth login path.
 * @param {string} config.paths.auth.logout - Auth logout path.
 *
 * @returns {Promise} Resolves when the routes have been configured, or rejects
 * if an error occurred.
 */
module.exports = async function routes(app, config) {
    const { paths } = config;

    // Set up authentication endpoints.
    const authRouter = new express.Router();
    authRouter.get(
        paths.auth.index,
        (req, res) => res.sendStatus(req.isAuthenticated ? 200 : 401).end()
    );
    authRouter.post(
        paths.auth.login,
        bodyParser.json({ limit: 1024 }),
        passport.authenticate('local', { failureRedirect: paths.auth.login }),
        (req, res) => res.sendStatus(200).end()
    );
    authRouter.get(
        paths.auth.logout,
        (req, res) => {
            req.logout();
            res.redirect('/');
        }
    );
    app.use(paths.auth.index, authRouter);

    // Set up SPA fallback.
    paths.public.forEach(dir => {
        const index = path.join(dir, 'index.html');
        app.use(serveFile(index));
    });

    return void 0;
};

