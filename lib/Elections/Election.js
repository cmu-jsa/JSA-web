'use strict';

/**
 * An election.
 *
 * @module Elections/Election
 */

/**
 * Represents an election.
 *
 * @alias module:Elections/Election
 */
class Election {
    /**
     * Initializes the election.
     *
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The candidates for the election.
     */
    constructor(title, candidates) {
        Object.defineProperties(this, {
            /**
             * `true` if the election is closed; `false` otherwise.
             *
             * @private
             * @type {boolean}
             */
            _closed: { value: false, writable: true },

            /**
             * The election's title.
             *
             * @readonly
             * @type {string}
             */
            title: { value: title },

            /**
             * The election's candidates.
             *
             * @readonly
             * @type {string[]}
             */
            candidates: { value: candidates }

        });
    }

    /**
     * `true` if the election is closed; `false` otherwise.
     *
     * @readonly
     * @type {boolean}
     */
    get closed() {
        return this._closed;
    }

    /**
     * Closes the election from further voting.
     *
     * Has no effect if the election is already closed.
     */
    close() {
        if (this.closed) {
            return;
        }

        this._closed = true;
    }
}

Object.freeze(Election);
module.exports = Election;

