'use strict';

/** @module main */

const path = require('path');
const express = require('express');

const preboots = require('./preboots');
const middlewares = require('./middlewares');
const routes = require('./routes');

/**
 * Creates and configures a server with the given configuration.
 *
 * @alias module:main
 *
 * @param {Object} config - App configuration options.
 *
 * @param {string} config.protocol - The server's protocol.
 * @param {string} config.hostname - The server's hostname.
 * @param {number} config.port - The server's listening port.
 * @param {boolean} config.servePublic - `true` to serve public files; `false`
 * otherwise.
 * @param {string} [config.express] - Express app settings.
 *
 * @param {Object} config.auth - Authentication configuration.
 * @param {string} config.auth.userFilePath - Path to username/password file for
 * use with `LocalAuth`.
 *
 * @param {Object} config.session - Session configuration.
 * @param {boolean} config.session.secure - Whether or not cookies are secure.
 * @param {string} config.session.secret - Secret used to sign cookies.
 * @param {string} config.session.storeFilePath - Path to persistent session
 * storage file.
 *
 * @returns {express~Application} Resolves with the configured
 * server, or rejects if an error occurred.
 */
async function server(config) {
    const app = express();

    if ('express' in config) {
        const expressConfig = config.express;
        Object.keys(expressConfig).forEach(key => {
            app.set(key, expressConfig[key]);
        });
    }

    const publicPaths = config.servePublic
        ? [
            path.resolve(__dirname, '../dist'),
            path.resolve(__dirname, '../public')
        ]
        : [];

    config.paths = {
        public: publicPaths,

        auth: {
            index: '/auth',
            login: '/login',
            logout: '/logout'
        },

        elections: {
            index: '/api/elections'
        }
    };

    await preboots(app, config);
    await middlewares(app, config);
    await routes(app, config);

    return app;
}

module.exports = server;

/**
 * Prints the command-line usage of the app.
 *
 * @private
 */
function usage() {
    const script = path.relative('.', require.main.filename);
    console.log(
        `Usage: ${script} <configPath>\n`
    );
}

/**
 * The command-line interface of the app.
 *
 * @private
 * @param {string[]} argv - The command-line arguments.
 */
function cli(argv) {
    // Default configuration.
    const config = {
        protocol: 'http',
        hostname: 'localhost',
        port: 8080,
        serveStatic: true
    };

    if (argv.length < 3) {
        usage();
        return;
    }

    const configPath = path.resolve(argv[2]);
    Object.assign(config, require(configPath));

    server(config).then(app => {
        app.listen(config.port, config.hostname);
    }).catch(err =>
        console.error(err)
    );
}

if (module === require.main) {
    return cli(process.argv);
}

