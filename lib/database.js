'use strict';

/** @module database */

const Sequelize = require('sequelize');

/**
 * The backing Sequelize instance, connected to a SQLite database
 *
 * @alias module:database
 * @type {external:sequelize}
 */
const database = new Sequelize('data', null, null, {
    dialect: 'sqlite',
    storage: './data.sqlite'
});

module.exports = database;

