'use strict';

/** @module routes */

const path = require('path');

/**
 * Creates a middleware that attempts to serve the given file.
 *
 * @param {string} file The path to the file.
 * @param {Object} [opts={}] The options for `res.sendFile`.
 * @returns {Function} The middleware.
 */
function serveFile(file, opts = {}) {
    return (req, res, next) => {
        res.sendFile(file, opts, err => {
            err && next(err);
        });
    };
}

/**
 * Configures routes for the given Express app.
 *
 * @param {external:express~Application} app - The app to configure.
 * @param {Object} config - Configuration options.
 *
 * @param {Object} config.paths - Endpoint paths.
 *
 * @param {string[]} config.paths.public - Static content directories.
 *
 * @param {Object} config.paths.auth - Authentication-related paths. @see
 * module:routes/elections
 *
 * @param {Object} config.paths.elections - Election system-related paths. @see
 * module:routes/auth
 *
 * @returns {Promise} Resolves when the routes have been configured, or rejects
 * if an error occurred.
 */
module.exports = async function routes(app, config) {
    const { paths } = config;

    await Promise.all([
        'auth',
        'elections'
    ].map(async key => {
        const pathConfig = paths[key];
        const router = await require(`./${key}`)(pathConfig);
        app.use(pathConfig.index, router);
    }));

    // Set up SPA fallback.
    paths.public.forEach(dir => {
        const index = path.join(dir, 'index.html');
        app.use(serveFile(index));
    });

    return void 0;
};

