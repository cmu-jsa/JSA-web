/**
 * Module for representing user state.
 *
 * @module src/Auth
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
    login: '/auth/login',
    /** Logout endpoint. */
    logout: '/auth/logout'
};
Object.freeze(API);

/**
 * Paths associated with the user interface.
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
 * Represents authentication state.
 *
 * @private
 */
class Auth {
    /**
     * Paths associated with the user interface.
     *
     * @readonly
     * @see module:src/Auth~UIPaths
     */
    get paths() { return UIPaths; }

    /**
     * Initializes the authentication state.
     */
    constructor() {
        Object.defineProperties(this,
            /** @lends Auth.prototype */
            {
                /**
                 * Username if logged in; `false` if not logged in; `null` if
                 * unknown (i.e., initial refresh not performed).
                 *
                 * @private
                 * @type {(string?|boolean)}
                 */
                _username: { value: null, writable: true },

                /**
                 * Authorization level, or `null` if unknown/not logged in.
                 *
                 * @private
                 * @type {number?}
                 */
                _authLevel: { value: null, writable: true },

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
                _logoutPromise: { value: null, writable: true }
            }
        );
    }

    /**
     * `true` if logged in; `false` if not logged in; `null` if
     * unknown (i.e., initial refresh not performed).
     *
     * @readonly
     * @type {boolean?}
     */
    get loggedIn() {
        return this.username === null
            ? null
            : !!this.username;
    }

    /**
     * Username if logged in; `false` if not logged in; `null` if
     * unknown (i.e., initial refresh not performed).
     *
     * @readonly
     * @type {(string?|boolean)}
     */
    get username() {
        return this._username;
    }

    /**
     * Authorization level, or `null` if unknown/not logged in.
     *
     * @readonly
     * @type {number?}
     */
    get authLevel() {
        return this._authLevel;
    }

    /**
     * Refreshes the login status.
     *
     * If an existing refresh request is in progress, its promise is returned
     * instead.
     *
     * @returns {Promise} Resolves with the user instance on completion, or
     * rejects with an error.
     */
    refreshLoginStatus() {
        if (this._refreshLoginStatusPromise) {
            return this._refreshLoginStatusPromise;
        }

        this._refreshLoginStatusPromise = (async() => {
            try {
                const {
                    status, responseText
                } = await XHRpromise('GET', API.auth);

                if (status === 200) {
                    const { username, authLevel } = JSON.parse(responseText);
                    this._username = username;
                    this._authLevel = authLevel;
                } else {
                    this._username = false;
                }
            } finally {
                this._refreshLoginStatusPromise = null;
            }
        })();
        return this._refreshLoginStatusPromise;
    }

    /**
     * Attempts to log in.
     *
     * If an existing login request is in progress, its promise is returned
     * instead.
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

        this._loginPromise = (async() => {
            try {
                if (this.loggedIn) {
                    return this;
                }

                const { status, responseText } = await XHRpromise(
                    'PUT', API.login, {
                        contentType: 'application/json',
                        body: JSON.stringify({ username, password })
                    }
                );

                if (status === 401) {
                    throw new Error('Incorrect username/password.');
                }

                if (status !== 200) {
                    throw new Error('Unknown error occurred.');
                }

                const { authLevel } = JSON.parse(responseText);
                this._username = username;
                this._authLevel = authLevel;
            } finally {
                this._loginPromise = null;
            }

            return this;
        })();
        return this._loginPromise;
    }

    /**
     * Attempts to log out.
     *
     * If an existing logout request is in progress, its promise is returned
     * instead.
     *
     * @returns {Promise} Resolves with the user instance on success, or rejects
     * with an error.
     */
    logout() {
        if (this._logoutPromise) {
            return this._logoutPromise;
        }

        this._logoutPromise = (async() => {
            try {
                await XHRpromise('GET', API.logout, {
                    successStatus: 204
                });

                this._username = false;
            } finally {
                this._logoutPromise = null;
            }

            return this;
        })();
        return this._logoutPromise;
    }
}

Object.freeze(Auth);

/**
 * Authentication state singleton.
 *
 * @alias module:src/Auth
 * @type {module:src/Auth~Auth}
 */
const state = new Auth();
export default state;

