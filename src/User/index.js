/**
 * Module for representing user state.
 *
 * @module src/User
 */

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
 * Creates and sends an XMLHttpRequest.
 *
 * @param {string} method - The method for the request.
 * @param {string} url - The URL for the request.
 * @param {Object} [opts] - Options for the request.
 * @param {string} [opts.body] - The request body.
 * @param {string} [opts.contentType] - The content type for the body.
 * @param {number?} [opts.successStatus=null] - The expected response status for
 * successful requests. If `null`, the promise resolves for any status.
 * @returns {Promise} Resolves with the completed request, or rejects with an
 * error.
 */
function XHRpromise(method, url, opts = {}) {
    const { body, contentType, successStatus = null } = opts;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.withCredentials = true;

        contentType && xhr.setRequestHeader('Content-Type', contentType);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== xhr.DONE) {
                return;
            }

            if (successStatus !== null && xhr.status !== successStatus) {
                return reject(new Error(
                    `'${method} ${url}' failed: `
                    + `expected status ${successStatus}, got ${xhr.status}`
                ));
            }

            return resolve(xhr);
        };

        xhr.send(body);
    });
}

/**
 * Represents user state.
 */
class User {
    /**
     * Initializes the user state.
     */
    constructor() {
        Object.defineProperties(this,
            /** @lends User.prototype */
            {
                /**
                 * `true` if logged in; `false` if not logged in; `null` if
                 * unknown (i.e., initial refresh not performed).
                 *
                 * @private
                 * @type {boolean}
                 */
                _loggedIn: { value: null, writable: true },

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
                 * `true` if logged in; `false` otherwise.
                 *
                 * @readonly
                 * @type {boolean}
                 */
                loggedIn: { get() { return this._loggedIn; } }
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
            const { status } = await XHRpromise('GET', API.auth);

            this._loggedIn = status === 200;
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

                this._loggedIn = true;
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

            this._loggedIn = false;
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

