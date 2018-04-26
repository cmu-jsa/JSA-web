'use strict';

/**
 * Provides a `passport` strategy based on a simple username-password CSV file.
 *
 * @module LocalAuth
 */

const fs = require('fs');
const readline = require('readline');
const LocalStrategy = require('passport-local');
const { csvParseRows, csvFormatRows } = require('d3-dsv');

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
 * Represents a user.
 */
class User {
    /**
     * Parses the given line for a user.
     *
     * @param {string} line - The line.
     * @returns {module:LocalAuth~User} The parsed user.
     */
    static parse(line) {
        const [{
            username, password, authLevel
        }] = csvParseRows(line, function(row) {
            const authName = row.length > 2
                ? row[2]
                : 'USER';

            if (!(authName in AuthLevels)) {
                throw new Error(`Invalid authentication level "${authName}"`);
            }

            return {
                username: row[0],
                password: row[1],
                authLevel: AuthLevels[authName]
            };
        });

        return new User(username, password, authLevel);
    }

    /**
     * Initializes a user.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {number} authLevel - The user's authentication level.
     */
    constructor(username, password, authLevel) {
        if (typeof username !== 'string') {
            throw new Error('Invalid username');
        }

        if (typeof password !== 'string') {
            throw new Error('Invalid password');
        }

        if (typeof authLevel !== 'number') {
            throw new Error('Invalid authentication level');
        }

        Object.defineProperties(this, {
            /**
             * The user's username.
             *
             * @readonly
             * @type {string}
             */
            username: { value: username },

            /**
             * The user's password.
             *
             * @readonly
             * @type {string}
             */
            password: { value: password },

            /**
             * The user's authentication level.
             *
             * @readonly
             * @type {number}
             */
            authLevel: { value: authLevel }
        });
    }

    /**
     * Converts the user to a file-format string.
     *
     * @returns {string} The string.
     */
    toString() {
        const { username, password, authLevel } = this;
        return csvFormatRows([[username, password, authLevel]]);
    }
}

Object.freeze(User);

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

        const strategy = new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, async(username, password, done) => {
            const user = await this.get(username);
            if (user && password === user.password) {
                return done(null, user);
            }

            return done(null, false);
        });

        Object.defineProperties(this,
            /** @lends module:LocalAuth.prototype */
            {
                /**
                 * The current file system promise, or `null`.
                 *
                 * @private
                 * @type {Promise?}
                 */
                fsPromise: { value: null, writable: true },

                /**
                 * Map of usernames to passwords.
                 *
                 * @private
                 * @type {Object}
                 */
                userMap: { value: userMap, writable: true },

                /**
                 * Path to the username-password CSV file.
                 *
                 * @readonly
                 * @type {string}
                 */
                filePath: { value: filePath },

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
     * @param {module:LocalAuth~User} user - The user.
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
    async deserializeUser(id, done) {
        try {
            const user = await this.get(id);
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }

    /**
     * Gets a user by their username.
     *
     * @param {string} username - The user's username.
     * @returns {Promise} Resolves with the user, or rejects with an error.
     */
    async get(username) {
        const { userMap } = this;
        if (!(username in userMap)) {
            throw new Error(`User "${username}" does not exist.`);
        }

        return userMap[username];
    }

    /**
     * Creates a new user.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {number} authLevel - The user's authentication level.
     * @param {boolean} [replace=false] - `true` to replace an existing user
     * with the same username; `false` otherwise.
     * @returns {Promise} Resolves with the user on completion, or rejects with
     * an error.
     */
    async create(username, password, authLevel, replace = false) {
        const { userMap } = this;
        if (username in userMap && !replace) {
            throw new Error(`User "${username}" already exists!`);
        }

        const user = new User(username, password, authLevel);
        userMap[username] = user;

        return user;
    }

    /**
     * Destroys a user.
     *
     * @param {string} username - The user's username.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async destroy(username) {
        const { userMap } = this;
        if (!(username in userMap)) {
            throw new Error(`User "${username}" does not exist!`);
        }

        delete userMap[username];

        return void 0;
    }

    /**
     * Gets a list of all usernames in the system.
     *
     * @returns {Promise} Resolves with the array of usernames.
     */
    async usernames() {
        return Object.keys(this.userMap);
    }

    /**
     * Flush the user map back into the CSV file.
     *
     * If a file system operation is already in progress, its promise is
     * returned.
     *
     * @returns {Promise} Resolves when the flush is complete, or rejects with
     * an error.
     */
    flush() {
        if (this.fsPromise) {
            return this.fsPromise;
        }

        const { userMap, filePath } = this;

        this.fsPromise = (async() => {
            let fileStream;
            try {
                fileStream = fs.createWriteStream(filePath, {
                    flags: 'w',
                    encoding: 'utf8',
                    autoClose: true
                });

                Object.keys(userMap).forEach(username => {
                    const user = userMap[username];
                    fileStream.write(user.toString());
                });

                await new Promise(resolve => {
                    fileStream.end(resolve);
                });
            } finally {
                fileStream && fileStream.destroy();
                this.fsPromise = null;
            }
        })();
        return this.fsPromise;
    }

    /**
     * Refreshes the user map by re-reading the CSV file.
     *
     * If a file system operation is already in progress, its promise is
     * returned.
     *
     * @returns {Promise} Resolves when the refresh is complete, or rejects with
     * an error.
     */
    reload() {
        if (this.fsPromise) {
            return this.fsPromise;
        }

        const { filePath } = this;

        this.fsPromise = (async() => {
            let fileStream;
            let rl;

            try {
                fileStream = fs.createReadStream(filePath, {
                    flags: 'r',
                    encoding: 'utf8',
                    autoClose: true
                });

                rl = readline.createInterface({
                    input: fileStream
                });

                this.userMap = await new Promise((resolve, reject) => {
                    let lineno = 0;
                    const users = Object.create(null);

                    rl.on('line', line => {
                        lineno++;
                        if (!line) {
                            return;
                        }

                        try {
                            const user = User.parse(line);
                            users[user.username] = user;
                        } catch (err) {
                            reject(new Error(
                                `${filePath}:${lineno}: ${err.message}`
                            ));
                        }
                    });

                    rl.once('close', () => {
                        resolve(users);
                    });
                });
            } finally {
                rl && rl.close();
                fileStream && fileStream.destroy();
                this.fsPromise = null;
            }
        })();
        return this.fsPromise;
    }
}

Object.freeze(LocalAuth);
module.exports = LocalAuth;

