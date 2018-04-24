'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const authStatus = require('../middlewares/authStatus');
const acceptsStatus = require('../middlewares/acceptsStatus');

/**
 * Responds with the current user's information.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 */
function sendUser(req, res) {
    const { username, authLevel } = req.user;
    res.send({ username, authLevel }).end();
}

/**
 * Middleware to attempt authentication.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 * @param {Function} next - The callback.
 */
function authenticate(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.set('Content-Type', 'text/plain')
                .status(401)
                .end();
        }

        req.login(user, next);
    })(req, res, next);
}

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
        authStatus(),
        sendUser
    );
    authRouter.put(
        paths.login,
        acceptsStatus('application/json'),
        bodyParser.json({ limit: 1024 }),
        authenticate,
        sendUser
    );
    authRouter.get(
        paths.logout,
        (req, res) => {
            req.logout();
            res.sendStatus(204).end();
        }
    );

    return authRouter;
};

