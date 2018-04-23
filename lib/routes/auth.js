'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const acceptsStatus = require('../middlewares/acceptsStatus');

/**
 * Configures authentication router.
 *
 * @param {Object} paths - Endpoint paths.
 * @param {string} paths.index - Router index.
 * @param {string} paths.login - Login.
 * @param {string} paths.logout - Logout.
 * @returns {Promise} Resolves with the router, or rejects with an error.
 */
module.exports = async function(paths) {
    const authRouter = new express.Router();
    authRouter.get(
        '/', acceptsStatus('application/json'),
        (req, res) => {
            if (!req.isAuthenticated()) {
                return res.sendStatus(401).end();
            }

            const { username, type } = req.user;
            res.send({ username, type }).end();
        }
    );
    authRouter.post(
        paths.login,
        bodyParser.json({ limit: 1024 }),
        passport.authenticate('local'),
        (req, res) => res.sendStatus(200).end()
    );
    authRouter.get(
        paths.logout,
        (req, res) => {
            req.logout();
            res.sendStatus(200).end();
        }
    );

    return authRouter;
};

