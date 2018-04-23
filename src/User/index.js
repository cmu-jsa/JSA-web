/**
 * Module for representing user state.
 *
 * @module src/User
 */

import XHRpromise from 'src/XHRpromise';

/**
 * API endpoints.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const API = {
    /** Authentication endpoint. */
    auth: '/auth',
    /** Login endpoint. */
    auth_login: '/auth/login',
    /** Logout endpoint. */
    auth_logout: '/auth/logout'
};
Object.freeze(API);

/**
 * UI paths.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const UIPaths = {
    /** Login UI. */
    login: '/login/'
};
Object.freeze(UIPaths);

/**
 * Represents user state.
 */
class User {
    /**
     * Paths associated with the user interface.
     *
     * @readonly
     * @type {Object}
     */
    get paths() { return UIPaths; }

    /**
     * Initializes the user state.
     */
    constructor() {
        Object.defineProperties(this,
            /** @lends User.prototype */
            {
                /**
                 * Username if logged in; `false` if not logged in; `null` if
                 * unknown (i.e., initial refresh not performed).
                 *
                 * @private
                 * @type {string?|boolean}
                 */
                _username: { value: null, writable: true },

                /**
                 * The current login refresh promise, or `null`.
                 *
                 * @private
                 * @type {Promise?}
                 */
                _refreshLoginStatusPromise: { value: null, writable: true },

                /**
                 * The current login promise, or `null`.
                 *
                 * @private
                 * @type {Promise?}
                 */
                _loginPromise: { value: null, writable: true },

                /**
                 * The current logout promise, or `null`.
                 *
                 * @private
                 * @type {Promise?}
                 */
                _logoutPromise: { value: null, writable: true },

                /**
                 * `true` if logged in; `false` if not logged in; `null` if
                 * unknown (i.e., initial refresh not performed).
                 *
                 * @readonly
                 * @type {boolean?}
                 */
                loggedIn: { get() {
                    return this.username === null
                        ? null
                        : !!this.username;
                } },

                /**
                 * Username if logged in; `false` if not logged in; `null` if
                 * unknown (i.e., initial refresh not performed).
                 *
                 * @readonly
                 * @type {string?|boolean}
                 */
                username: { get() { return this._username; } }
            }
        );
    }

    /**
     * Refreshes the login status.
     *
     * @note If an existing refresh request is in progress, its promise is
     * returned instead.
     *
     * @returns {Promise} Resolves with the user instance on completion, or
     * rejects with an error.
     */
    refreshLoginStatus() {
        if (this._refreshLoginStatusPromise) {
            return this._refreshLoginStatusPromise;
        }

        this._refreshLoginStatusPromise = async function() {
            const { status, responseText } = await XHRpromise('GET', API.auth);

            this._username = status === 200
                ? responseText
                : false;
        }.bind(this)();
        return this._refreshLoginStatusPromise;
    }

    /**
     * Attempts to log in.
     *
     * @note If an existing login request is in progress, its promise is
     * returned instead.
     *
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    login(username, password) {
        if (this._loginPromise) {
            return this._loginPromise;
        }

        this._loginPromise = async function() {
            if (this.loggedIn === null) {
                await this.refreshLoginStatus();
            }

            if (!this.loggedIn) {
                await XHRpromise('POST', API.auth_login, {
                    contentType: 'application/json',
                    body: JSON.stringify({ username, password }),
                    successStatus: 200
                });

                this._username = username;
            }

            this._loginPromise = null;
            return this;
        }.bind(this)();
        return this._loginPromise;
    }

    /**
     * Attempts to log out.
     *
     * @note If an existing logout request is in progress, its promise is
     * returned instead.
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    logout() {
        if (this._logoutPromise) {
            return this._logoutPromise;
        }

        this._logoutPromise = async function() {
            await XHRpromise('GET', API.auth_logout, {
                successStatus: 200
            });

            this._username = false;
            this._logoutPromise = null;
            return this;
        }.bind(this)();
        return this._logoutPromise;
    }
}

Object.freeze(User);

/**
 * User state singleton.
 *
 * @alias module:src/User
 * @type {module:src/User~User}
 */
const state = new User();
export default state;

