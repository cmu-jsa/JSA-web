'use strict';

/**
 * Election system.
 *
 * @module Elections
 */

const uuidv5 = require('uuid/v5');

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
        const elections = Object.create(null);

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
        const id = uuidv5('cmujsa.com', uuidv5.DNS);
        const election = new Election(id, title, candidates);
        this.elections[id] = election;

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
     * Gets all election IDs in the system.
     *
     * @returns {string[]} All election IDs in the system.
     */
    enumerate() {
        return Object.keys(this.elections);
    }
}

Object.freeze(Elections);
module.exports = Elections;

