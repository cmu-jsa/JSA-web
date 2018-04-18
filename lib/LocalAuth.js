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
            if (username in userMap && userMap[username] === password) {
                return done(null, username);
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
        // In our case, the users are just their IDs.
        return done(null, user);
    }

    /**
     * Deserializes the given user ID.
     *
     * @param {string} id - The user's ID.
     * @param {Function} done - The callback.
     * @returns {*} The result of `done()`.
     */
    deserializeUser(id, done) {
        // In our case, the users are just their IDs.
        return done(null, id);
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
                userMap[username] = password;
                lineno++;
            });

            rl.once('close', resolve);
        });

        return void 0;
    }
}

Object.freeze(LocalAuth);
module.exports = LocalAuth;

