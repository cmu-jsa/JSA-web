'use strict';

/** @module middlewares */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');


/**
 * Configures global middlewares on the given Express app.
 *
 * @param {external:express~Application} app - The express app.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {Object} config.paths.public - Static public file directory.
 *
 * @param {Object} config.session - Session configuration.
 * @param {string} config.session.secret - Secret used to sign cookies.
 * @param {external:express-session~Store} config.session.store - Persistent
 * session store.
 *
 * @returns {Promise} Resolves when the middlewares have been configured, or
 * rejects if an error occurred.
 */
module.exports = function middlewares(app, config) {
    const publicPath = config.paths.public;

    // Set up middlewares
    if (publicPath instanceof Array) {
        publicPath.forEach(path => app.use(express.static(path)));
    } else {
        app.use(express.static(publicPath));
    }

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.session.secret,
        store: config.session.store
    }));

    return Promise.resolve();
};

