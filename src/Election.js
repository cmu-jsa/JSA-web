/**
 * Module for representing election state.
 *
 * @module src/Election
 */

import { bool, string, arrayOf, shape } from 'prop-types';

import XHRpromise from 'src/XHRpromise';

/**
 * API endpoints.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const API = {
    /** Elections base URI. */
    elections: '/api/elections',

    /**
     * Election URI.
     *
     * @param {string} id - The election's ID.
     * @returns {string} The URI.
     */
    election(id) {
        return `${API.elections}/${id}`;
    }
};

/**
 * Represents an election.
 *
 * @private
 * @typedef {Object} Election
 * @property {string} id - The election's ID.
 * @property {string} title - The election's title.
 * @property {string[]} candidates - The election's candidates.
 * @property {boolean} closed - `true` if closed; `false` otherwise.
 * @property {boolean} voted - `true` if voted; `false` otherwise.
 */

/**
 * Election shape.
 *
 * @readonly
 * @type {Object}
 */
const electionShape = shape({
    id: string.isRequired,
    title: string.isRequired,
    candidates: arrayOf(string).isRequired,
    closed: bool.isRequired,
    voted: bool.isRequired
});
export { electionShape };

/**
 * Represents election state.
 */
class Election {
    /**
     * Initializes the election state.
     */
    constructor() {
        Object.defineProperties(this, {
            /**
             * The current election opening promise, or `null`.
             *
             * @private
             * @type {Promise?}
             */
            _openPromise: { value: null, writable: true }
        });
    }

    /**
     * Gets the election list.
     *
     * @returns {Promise} Resolves with the election list on completion, or
     * rejects with an error.
     */
    async getAll() {
        const { responseText } = await XHRpromise('GET', API.elections, {
            successStatus: 200
        });

        const elections = JSON.parse(responseText);
        Object.keys(elections).map(id => {
            elections[id].id = id;  // Fill in ID property.
        });

        return elections;
    }

    /**
     * Gets information about the given election.
     *
     * @param {string} id - The election's ID.
     * @returns {Promise} Resolves with the election's information, or rejects
     * with an error.
     */
    async get(id) {
        const uri = API.election(id);
        const { responseText } = await XHRpromise('GET', uri, {
            successStatus: 200
        });

        const election = JSON.parse(responseText);
        election.id = id;
        return election;
    }

    /**
     * Opens a new election.
     *
     * If an existing request is in progress, its promise is returned.
     *
     * @param {string} title - The title for the election.
     * @param {string[]} candidates - The candidates for the election.
     * @returns {Promise} Resolves with the election's ID on completion, or
     * rejects with an error.
     */
    open(title, candidates) {
        if (this._openPromise) {
            return this._openPromise;
        }

        const body = JSON.stringify({ title, candidates });

        this._openPromise = (async() => {
            try {
                const {
                    status, responseText
                } = await XHRpromise('POST', API.elections, {
                    body,
                    contentType: 'application/json'
                });

                if (status === 400) {
                    throw new Error(responseText);
                }

                if (status !== 201) {
                    throw new Error('Unknown error occurred.');
                }

                return responseText;
            } finally {
                this._openPromise = null;
            }
        })();
        return this._openPromise;
    }

    /**
     * Submits the chosen vote.
     *
     * @param {string} id - The election ID.
     * @param {string} candidate - The candidate to vote for.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async vote(id, candidate) {
        const body = candidate;
        const uri = API.election(id);

        const {
            status, responseText
        } = await XHRpromise('PUT', uri, {
            body,
            contentType: 'text/plain'
        });

        if (status === 400) {
            throw new Error(responseText);
        }

        if (status !== 204) {
            throw new Error('Unknown error occurred.');
        }

        return void 0;
    }
}

Object.freeze(Election);

/**
 * Election state singleton.
 *
 * @alias module:src/Election
 * @type {module:src/Election~Election}
 */
const state = new Election();
export default state;

