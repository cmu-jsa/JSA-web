'use strict';

/** @module routes/elections */

const bodyParser = require('body-parser');
const express = require('express');

/**
 * Configures election system router.
 *
 * @param {Object} paths - Endpoint paths.
 * @param {string} paths.index - Router index.
 * @returns {Promise} Resolves with the router, or rejects with an error.
 */
module.exports = async function elections(paths) {
    const electionsRouter = new express.Router();

    // TODO
    void paths;
    void bodyParser;

    return electionsRouter;
};

