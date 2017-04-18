'use strict';

const auth = require('./auth');

/** @module preboots */

/**
 * Configures pre-boot settings for the given Express app.
 *
 * @private
 * @param {external:express~Application} app - The Express app to configure.
 * @param {Object} config - Configuration options.
 * @returns {Promise} Resolves when pre-boot configuration has finished, or
 * rejects if an error occurred.
 */
module.exports = function preboots(app, config) {
    return auth(app, config);
};

