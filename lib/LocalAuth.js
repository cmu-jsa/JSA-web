'use strict';

/**
 * Provides a `passport` strategy based on a simple username-password CSV file.
 *
 * @module LocalAuth
 */

const fs = require('fs');
const readline = require('readline');
const LocalStrategy = require('passport-local');

/**
 * The authenticator.
 *
 * @alias module:LocalAuth
 */
class LocalAuth {
    /**
     * Initializes the authenticator.
     *
     * @param {string} filePath - Path to the username-password CSV file.
     */
    constructor(filePath) {
        const userMap = Object.create(null);

        /**
         * Attempts to authenticate a user.
         *
         * @private
         * @param {string} username - The username.
         * @param {string} password - The password.
         * @param {Function} done - The strategy callback. The returned user is
         * just the username.
         * @returns {*} The result of `done()`.
         */
        function authenticate(username, password, done) {
            if (username in userMap) {
                const user = userMap[username];
                if (password === user.password) {
                    return done(null, user);
                }
            }

            return done(null, false);
        }

        const strategy = new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, authenticate);

        Object.defineProperties(this,
            /** @lends module:LocalAuth.prototype */
            {
                /**
                 * Path to the username-password CSV file.
                 *
                 * @readonly
                 * @type {string}
                 */
                filePath: { value: filePath },

                /**
                 * Map of usernames to passwords.
                 *
                 * @private
                 * @readonly
                 * @type {Object}
                 */
                userMap: { value: userMap },

                /**
                 * `passport` strategy for the authenticator.
                 *
                 * @readonly
                 * @type {passport~Strategy}
                 */
                strategy: { value: strategy }
            }
        );

        this.serializeUser = this.serializeUser.bind(this);
        this.deserializeUser = this.deserializeUser.bind(this);

        this.refresh();
    }

    /**
     * Serializes the given user.
     *
     * @param {*} user - The user.
     * @param {Function} done - The callback.
     * @returns {*} The result of `done()`.
     */
    serializeUser(user, done) {
        return done(null, user.username);
    }

    /**
     * Deserializes the given user ID.
     *
     * @param {string} id - The user's ID (i.e., username).
     * @param {Function} done - The callback.
     * @returns {*} The result of `done()`.
     */
    deserializeUser(id, done) {
        if (!(id in this.userMap)) {
            return done(new Error(`User ${id} not found`));
        }

        return done(null, this.userMap[id]);
    }

    /**
     * Refreshes the user map by re-reading the CSV file.
     *
     * @returns {Promise} Resolves when the refresh is complete, or rejects with
     * an error.
     */
    async refresh() {
        const { filePath, userMap } = this;

        const fileStream = fs.createReadStream(filePath, {
            flags: 'r',
            encoding: 'utf8',
            autoClose: true
        });

        const rl = readline.createInterface({
            input: fileStream
        });

        await new Promise((resolve, reject) => {
            let lineno = 1;

            rl.on('line', line => {
                if (!line) {
                    return;
                }

                const fields = line.split(',');
                if (fields.length < 2) {
                    return reject(new Error(
                        `${filePath}:${lineno}: Invalid line '${line}'`
                    ));
                }

                const [username, password] = fields;
                userMap[username] = {
                    username, password
                };
                lineno++;
            });

            rl.once('close', resolve);
        });

        return void 0;
    }
}

Object.freeze(LocalAuth);
module.exports = LocalAuth;

