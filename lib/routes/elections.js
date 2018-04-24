'use strict';

/** @module routes/elections */

const bodyParser = require('body-parser');
const express = require('express');

const { AuthLevels } = require('../LocalAuth');
const authStatus = require('../middlewares/authStatus');
const acceptsStatus = require('../middlewares/acceptsStatus');

/**
 * Creates middleware for getting the current election.
 *
 * The election system is placed in `req.elections`, and the current election is
 * placed in `req.election`; if it is not specified/found, it is `null`.
 *
 * @param {number} [errStatus] If specified, ends the response with the given
 * status if the election does not exist.
 * @returns {Function} The middleware.
 */
function electionCurr(errStatus) {
    return function(req, res, next) {
        const {
            app: { elections },
            params: { id }
        } = req;

        req.elections = elections;
        req.election = id
            ? elections.get(id)
            : null;
        if (!req.election && errStatus) {
            return res.status(errStatus).end();
        }

        return next();
    };
}

/**
 * Configures election system router.
 *
 * @param {Object} paths - Endpoint paths.
 * @param {string} paths.index - Router index.
 * @returns {Promise} Resolves with the router, or rejects with an error.
 */
module.exports = async function(paths) {
    const { index } = paths;

    const electionsRouter = new express.Router();

    electionsRouter.get(
        '/',
        acceptsStatus('application/json'),
        authStatus(),
        function(req, res) {
            const { user, app: { elections } } = req;
            const list = elections.enumerate(user.username);
            res.send(list).end();
        }
    );

    electionsRouter.post(
        '/',
        authStatus(AuthLevels.admin),
        electionCurr(),
        bodyParser.json(),
        function(req, res) {
            const {
                elections,
                body: { title, candidates }
            } = req;

            let status;
            let message;
            try {
                const id = elections.open(title, candidates);
                res.set('Location', `${index}/${id}`);
                status = 201;
                message = id;
            } catch (err) {
                status = 400;
                message = err.message;
            }

            res.status(status)
                .set('Content-Type', 'text/plain')
                .send(message)
                .end();
        }
    );

    electionsRouter.get(
        '/:id',
        acceptsStatus('application/json'),
        authStatus(),
        electionCurr(404),
        function(req, res) {
            const { election } = req;
            const { id, title, candidates } = election;

            const body = {
                id, title, candidates
            };

            if (req.user.type === 'admin') {
                body.voteCount = election.voteCount;
                body.finalVotes = election.finalVotes;
            }

            res.send(body).end();
        }
    );

    electionsRouter.delete(
        '/:id',
        authStatus(AuthLevels.admin),
        electionCurr(404),
        function(req, res) {
            let status;
            let message;

            try {
                req.elections.destroy(req.election.id);
                status = 204;
                message = '';
            } catch (err) {
                status = 400;
                message = err.message;
            }

            res.status(status)
                .set('Content-Type', 'text/plain')
                .send(message)
                .end();
        }
    );

    electionsRouter.patch(
        '/:id',
        authStatus(AuthLevels.admin),
        electionCurr(404),
        function(req, res) {
            req.election.close();
            res.status(204).end();
        }
    );

    electionsRouter.put(
        '/:id',
        authStatus(),
        electionCurr(404),
        bodyParser.text(),
        function(req, res) {
            const { user, body: candidate } = req;

            let status;
            let message;

            try {
                req.election.vote(candidate, user.username);
                status = 204;
                message = '';
            } catch (err) {
                status = 400;
                message = err.message;
            }

            res.status(status)
                .set('Content-Type', 'text/plain')
                .send(message)
                .end();
        }
    );

    return electionsRouter;
};

