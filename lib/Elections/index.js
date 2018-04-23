'use strict';

/**
 * Election system.
 *
 * @module Elections
 */

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
     * @param {string} id - The election's ID.
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The candidates for the election.
     */
    open(id, title, candidates) {
        if (id in this.elections) {
            throw new Error(`Election with ID '${id}' already exists!`);
        }

        const election = new Election(title, candidates);
        this.elections[id] = election;
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
}

Object.freeze(Elections);
module.exports = Elections;

