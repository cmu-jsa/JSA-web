'use strict';

/** @module main */

const fs = require('fs');
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
 * @param {string} [config.protocol = 'http'] - The server's protocol.
 * @param {string} [config.hostname = 'localhost'] - The server's hostname.
 * @param {number} [config.port = 8080] - The server's listening port.
 *
 * @param {Object} config.auth - Authentication configuration.
 * @param {string} config.auth.userFilePath - Path to username/password file for
 * use with `LocalAuth`.
 *
 * @param {Object} config.session - Session configuration.
 * @param {string} config.session.secret - Secret used to sign cookies.
 * @param {string} config.session.storeFilePath - Path to persistent session
 * storage file.
 *
 * @param {Object} [config.paths] - Endpoint paths.
 * @param {string[]} [config.paths.public=...] - Static content directories.
 * @param {string} [config.paths.loginUI = '/login'] - Login UI path.
 * @param {Object} [config.paths.auth] - Authentication-related paths.
 * @param {string} [config.paths.auth.index = '/auth'] - Base path for
 * @param {string} [config.paths.auth.login = ''] - Auth login path.
 * @param {string} [config.paths.auth.logout = '/logout'] - Auth logout path.
 *
 * @returns {express~Application} Resolves with the configured
 * server, or rejects if an error occurred.
 */
async function server(config) {
    const app = express();

    // Set up default options
    config = Object.assign({
        protocol: 'http',
        hostname: 'localhost',
        port: 8080
    }, config);

    // Merge default paths with configuration
    config.paths = Object.assign({
        // Static content paths
        public: [
            path.resolve(__dirname, '../dist'),
            path.resolve(__dirname, '../public')
        ],

        loginUI: '/login/',

        // Authentication-related paths
        auth: {
            index: '/auth',
            login: '/login',
            logout: '/logout'
        }
    }, config.paths);

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
        `Usage: ${script} <secretsFilePath> [port=8080]\n`
    );
}

/**
 * The command-line interface of the app.
 *
 * @private
 * @param {string[]} argv - The command-line arguments.
 */
function cli(argv) {
    if (argv.length < 3) {
        usage();
        return;
    }

    const secretsFilePath = argv[2];

    const {
        auth, session
    } = JSON.parse(fs.readFileSync(secretsFilePath));

    const port = argv[3] ? Number.parseInt(argv[3], 10) : 8080;

    const config = {
        port,
        auth,
        session
    };

    server(config).then(app => {
        app.listen(port);
    }).catch(err =>
        console.error(err)
    );
}

if (module === require.main) {
    return cli(process.argv);
}

