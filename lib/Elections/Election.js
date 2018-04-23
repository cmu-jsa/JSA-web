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
     * @param {string} id - The election's ID.
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The candidates for the election.
     */
    constructor(id, title, candidates) {
        const cookies = {};
        const votes = {};

        candidates.forEach(candidate => {
            votes[candidate] = 0;
        });

        Object.defineProperties(this, {
            /**
             * `true` if the election is closed; `false` otherwise.
             *
             * @private
             * @type {boolean}
             */
            _closed: { value: false, writable: true },

            /**
             * Current number of votes submitted.
             *
             * @private
             * @type {number}
             */
            _voteCount: { value: 0, writable: true },

            /**
             * Set of all voted cookies.
             *
             * @private
             * @readonly
             * @type {Object<string, boolean>}
             */
            cookies: { value: cookies },

            /**
             * Map from candidate names to their vote counts.
             *
             * @private
             * @readonly
             * @type {Object<string, number>}
             */
            votes: { value: votes },

            /**
             * The election's ID.
             *
             * @readonly
             * @type {string}
             */
            id: { value: id },

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
     * Current number of votes submitted.
     *
     * @readonly
     * @type {number}
     */
    get voteCount() {
        return this._voteCount;
    }

    /**
     * Map from candidates to final votes, or `null` if the election has not
     * been closed yet.
     *
     * @readonly
     * @type {Object<string, number>?}
     */
    get finalVotes() {
        return this.closed
            ? this.votes
            : null;
    }

    /**
     * Closes the election from further voting.
     *
     * Has no effect if the election is already closed.
     */
    close() {
        !this.closed && (this._closed = true);
    }

    /**
     * Places a vote for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @param {string} [cookie] - Multiple votes with the same cookie are
     * rejected.
     */
    vote(candidate, cookie) {
        if (this.closed) {
            throw new Error('Election already closed!');
        }

        if (!(candidate in this.votes)) {
            throw new Error(`Candidate '${candidate}' not found!`);
        }

        if (cookie) {
            if (cookie in this.cookies) {
                throw new Error('Vote already submitted!');
            }

            this.cookies[cookie] = true;
        }

        this._voteCount++;
        this.votes[candidate]++;
    }
}

Object.freeze(Election);
module.exports = Election;

