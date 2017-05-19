'use strict';

/** @module main */

const fs = require('fs');
const path = require('path');
const express = require('express');
const SequelizeStore = require('connect-session-sequelize')(
    require('express-session').Store
);

const database = require('./database');
const User = require('./models/user');
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
 * @param {string} config.auth.clientID - The Google OAuth client ID.
 * @param {string} config.auth.clientSecret - The Google OAuth client secret.
 * @param {string} config.auth.callbackURL - The callback URL.
 *
 * @param {Object} config.session - Session configuration.
 * @param {string} config.session.secret - Secret used to sign cookies.
 * @param {external:express-session~Store} [config.session.store] - Persistent
 * session storage.
 *
 * @param {Object} config.paths - Endpoint paths.
 * @param {string} config.paths.public - Static public file directory.
 * @param {string} [config.paths.loginUI = '/login'] - Login UI path.
 * @param {Object} [config.paths.auth] - Authentication-related paths.
 * @param {string} [config.paths.auth.index = '/auth/google'] - Base path for
 * authentication endpoints.
 * @param {string} [config.paths.auth.login = ''] - Auth login path.
 * @param {string} [config.paths.auth.callback = '/callback'] - Auth callback
 * path.
 * @param {string} [config.paths.auth.logout = '/logout'] - Auth logout path.
 *
 * @returns {Promise<external:express~Application>} Resolves with the configured
 * server, or rejects if an error occurred.
 */
function server(config) {
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
            index: '/auth/google',
            login: '',
            callback: '/callback/',
            logout: '/logout/'
        }
    }, config.paths);

    if (!config.session.store) {
        // Create session store model
        config.session.store = new SequelizeStore({
            db: database
        });
    }

    return Promise.all([
        config.session.store,
        User
    ].map(model =>
        model.sync()
    )).then(() =>
        preboots(app, config)
    ).then(() =>
        middlewares(app, config)
    ).then(() =>
        routes(app, config)
    ).then(() =>
        app
    );
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

