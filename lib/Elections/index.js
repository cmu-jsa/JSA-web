'use strict';

/**
 * Election system.
 *
 * @module Elections
 */

const uuidv4 = require('uuid/v4');

const Election = require('./Election');

/**
 * Represents a set of elections.
 *
 * @alias module:Elections
 */
class Elections {
    /**
     * Initializes the election system.
     */
    constructor() {
        const elections = {};

        Object.defineProperties(this, {
            /**
             * Elections in the system.
             *
             * @private
             * @readonly
             * @type {Object<string, module:Elections/Election[]>}
             */
            elections: { value: elections }
        });
    }

    /**
     * Starts a new election.
     *
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The candidates for the election.
     * @returns {string} The election's ID.
     */
    open(title, candidates) {
        const { elections } = this;
        const id = uuidv4();
        if (id in elections) {
            throw new Error(`Election with ID '${id}' already exists!`);
        }

        const election = new Election(id, title, candidates);
        elections[id] = election;

        return id;
    }

    /**
     * Destroys the election with the given ID, removing it from the system.
     *
     * @param {string} id - The election's ID.
     */
    destroy(id) {
        const election = this.elections[id];
        if (!election) {
            throw new Error(`Election with ID '${id}' not found!`);
        }

        election.close();
        delete this.elections[id];
    }

    /**
     * Gets the election with the given ID.
     *
     * @param {string} id - The election's ID.
     * @returns {module:Elections/Election?} The election, or `null` if no
     * election has the given ID.
     */
    get(id) {
        return this.elections[id] || null;
    }

    /**
     * Gets a map of all election IDs to an object containing their `title` and
     * `candidates`.
     *
     * @returns {Object<string,Object>} The map.
     */
    enumerate() {
        const { elections } = this;
        const map = {};
        Object.keys(elections).forEach(key => {
            const { title, candidates } = elections[key];
            map[key] = { title, candidates };
        });
        return map;
    }
}

Object.freeze(Elections);
module.exports = Elections;

