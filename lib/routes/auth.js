'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const { AuthLevels } = require('../LocalAuth');
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
 * Middleware to get the user for a user-related request.
 *
 * The user is placed in `req.authUser`, and the `LocalAuth` instance is placed
 * in `req.auth`.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 * @param {Function} next - The callback.
 * @returns {Promise} Resolves on completion, or rejects with an error.
 */
async function getAuthUser(req, res, next) {
    const {
        app: { localAuth },
        params: { username }
    } = req;

    try {
        req.user = await localAuth.get(username);
        return next();
    } catch (err) {
        return res.set('Content-Type', 'text/plain')
            .status(404)
            .send(err.message)
            .end();
    }
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
 * @param {string} paths.users - Users.
 * @returns {Promise} Resolves with the router, or rejects with an error.
 */
module.exports = async function(paths) {
    const authRouter = new express.Router();
    authRouter.get(
        '/',
        acceptsStatus('application/json'),
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
            res.set('Content-Type', 'text/plain')
                .status(204)
                .end();
        }
    );

    authRouter.get(
        paths.users,
        acceptsStatus('application/json'),
        authStatus(AuthLevels.ADMIN),
        async(req, res) => {
            const { localAuth } = req.app;

            const usernames = await localAuth.usernames();
            res.send(usernames).end();
        }
    );

    const userPath = `${paths.user}/:username`;
    authRouter.put(
        userPath,
        authStatus(AuthLevels.ADMIN),
        bodyParser.json(),
        async(req, res) => {
            const {
                app: { localAuth },
                params: { username },
                body
            } = req;

            const { password, authLevel, replace } = body;

            let status;
            let message;
            try {
                await localAuth.create(username, password, authLevel, replace);

                status = replace ? 204 : 201;
                message = '';
            } catch (err) {
                status = 400;
                message = err.message;
            }

            res.set('Content-Type', 'text/plain')
                .status(status)
                .message(message)
                .end();
        }
    );
    authRouter.get(
        userPath,
        acceptsStatus('application/json'),
        authStatus(AuthLevels.ADMIN),
        getAuthUser,
        async(req, res) => {
            const { username, password, authLevel } = req.authUser;
            res.send({ username, password, authLevel }).end();
        }
    );
    authRouter.delete(
        userPath,
        authStatus(AuthLevels.ADMIN),
        bodyParser.json(),
        getAuthUser,
        async(req, res) => {
            const { auth, authUser } = req;

            let status;
            let message;
            try {
                await auth.destroy(authUser.username);

                status = 204;
                message = '';
            } catch (err) {
                status = 400;
                message = err.message;
            }

            res.set('Content-Type', 'text/plain')
                .status(status)
                .message(message)
                .end();
        }
    );

    return authRouter;
};

