/**
 * Module for managing users.
 *
 * @module src/Auth/Users
 */

import XHRpromise from 'src/XHRpromise';

import { number, string, shape } from 'prop-types';

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
 * Represents a user.
 *
 * @private
 * @typedef {Object} User.
 * @property {string} username - The user's username.
 * @property {string} [password] - The user's password.
 * @property {number} [authLevel] - The user's authentication level.
 */

/**
 * User shape.
 *
 * @readonly
 * @type {Object}
 */
const userShape = shape({
    username: string.isRequired,
    password: string,
    authLevel: number
});
export { userShape };

/**
 * Represents the user management interface.
 *
 * @alias module:src/Auth/Users
 */
class Users {
    /**
     * Attempts to get all users.
     *
     * @returns {Promise} Resolves with `module:src/Auth/Users~User[]`, or
     * rejects with an error.
     */
    static async getAll() {
        const { responseText } = await XHRpromise('GET', API.users, {
            successStatus: 200
        });

        return JSON.parse(responseText).map(username => {
            return { username };
        });
    }

    /**
     * Attempts to create a user.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {string} auth - The user's authentication level name.
     * @param {boolean} [replace=false] - `true` to replace an existing user
     * with the same username; `false` to reject if the user exists.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    static async create(username, password, auth, replace = false) {
        const body = JSON.stringify({ password, auth, replace });
        const uri = API.user(username);
        const success = replace ? 204 : 201;

        const { status, responseText } = await XHRpromise('PUT', uri, {
            body,
            contentType: 'application/json'
        });
        if (status !== success) {
            throw new Error(responseText);
        }

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

        const { status, responseText } = await XHRpromise('DELETE', uri);
        if (status !== 204) {
            throw new Error(responseText);
        }

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

        const { status, responseText } = await XHRpromise('GET', uri);
        if (status !== 200) {
            throw new Error(responseText);
        }

        const user = JSON.parse(responseText);
        user.username = username;

        return user;
    }
}
Object.freeze(Users);

export default Users;

