/**
 * Election constants.
 *
 * @module src/routes/elections/election
 */

import { arrayOf, shape, string } from 'prop-types';

/**
 * API endpoints.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const API = {
    /** Elections base URL. */
    elections: '/api/elections'
};
export { API };

/**
 * Represents an election.
 *
 * @private
 * @typedef {Object} Election
 * @property {string} id - The election's ID.
 * @property {string} title - The election's title.
 * @property {string[]} candidates - The election's candidates.
 * @property {boolean} voted - `true` if voted; `false` otherwise.
 */

const electionShape = shape({
    id: string.isRequired,
    title: string.isRequired,
    candidates: arrayOf(string).isRequired
});
export { electionShape };

