/**
 * Module for managing users.
 *
 * @module src/Auth/Users
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
    /** Users endpoint. */
    users: '/auth/users',

    /**
     * User endpoint.
     *
     * @param {string} username - The user's username.
     * @returns {string} The URI.
     */
    user(username) {
        return `${API.users}/${username}`;
    }
};
Object.freeze(API);

/**
 * Represents the user management interface.
 *
 * @alias module:src/Auth/Users
 */
class Users {
    /**
     * Attempts to list all usernames.
     *
     * @returns {Promise} Resolves with the list of all usernames, or rejects
     * with an error.
     */
    static async list() {
        const { responseText } = await XHRpromise('GET', API.users, {
            successStatus: 200
        });

        return JSON.parse(responseText);
    }

    /**
     * Attempts to create a user.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {number} authLevel - The user's authentication level.
     * @param {boolean} replace - `true` to replace an existing user with the
     * same username; `false` to reject if the user exists.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    static async create(username, password, authLevel, replace) {
        const body = JSON.stringify({ password, authLevel, replace });
        const uri = API.user(username);

        await XHRpromise('PUT', uri, {
            successStatus: replace ? 204 : 201,
            body,
            contentType: 'application/json'
        });

        return void 0;
    }

    /**
     * Attempts to destroy a user.
     *
     * @param {string} username - The user's username.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    static async destroy(username) {
        const uri = API.user(username);

        await XHRpromise('DELETE', uri, {
            successStatus: 204
        });

        return void 0;

    }

    /**
     * Gets information about the user.
     *
     * @param {string} username - The user's username.
     * @returns {Promise} Resolves with the user's information on completion, or
     * rejects with an error.
     */
    static async get(username) {
        const uri = API.user(username);

        const { responseText } = await XHRpromise('GET', uri, {
            successStatus: 200
        });

        const user = JSON.parse(responseText);
        user.username = username;

        return user;
    }
}
Object.freeze(Users);

export default Users;

