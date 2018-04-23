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
 * Authorization levels.
 *
 * @private
 * @readonly
 * @enum {number}
 */
const AuthLevels = {
    USER: 0,
    ADMIN: 1000
};
Object.freeze(AuthLevels);

/**
 * Parses the given line for a user.
 *
 * @param {string} line - The line.
 * @returns {Object} The parsed user.
 */
function parseUserLine(line) {
    const fields = line.split(',');
    if (fields.length < 2) {
        throw new Error(`Invalid line '${line}'`);
    }

    const [username, password] = fields;

    let authLevel = AuthLevels.USER;
    if (fields.length > 2) {
        const level = fields[2];
        if (!(level in AuthLevels)) {
            throw new Error(`Invalid level '${level}'`);
        }
    }

    return { username, password, authLevel };
}

/**
 * The authenticator.
 *
 * @alias module:LocalAuth
 */
class LocalAuth {
    /**
     * Authorization levels.
     *
     * @readonly
     * @enum {number}
     */
    static get AuthLevels() {
        return AuthLevels;
    }

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
     * Authorization levels.
     *
     * @readonly
     * @enum {number}
     */
    get AuthLevels() {
        return AuthLevels;
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

        try {
            await new Promise((resolve, reject) => {
                let lineno = 0;

                rl.on('line', line => {
                    lineno++;
                    if (!line) {
                        return;
                    }

                    try {
                        const user = parseUserLine(line);
                        userMap[user.username] = user;
                    } catch (err) {
                        reject(new Error(
                            `${filePath}:${lineno}: ${err.message}`
                        ));
                    }
                });

                rl.once('close', resolve);
            });
        } catch (err) {
            rl.close();
            fileStream.destroy();
            throw err;
        }

        return void 0;
    }
}

Object.freeze(LocalAuth);
module.exports = LocalAuth;

