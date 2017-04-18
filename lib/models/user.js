'use strict';

/** @module models/user */

const Sequelize = require('sequelize');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');

const database = require('../database');

/**
 * Represents a user.
 *
 * @alias module:models/user
 */
const User = database.define(
    'User',
    /** @lends module:models/user.prototype */
    {
        /**
         * The user's Google ID.
         *
         * @type {string}
         */
        googleID: {
            type: Sequelize.TEXT
        }
    }, {
        /** @lends module:models/user */
        classMethods: {
            /**
             * Creates a Passport strategy for authenticating users via their
             * Google account and OAuth 2.0.
             *
             * @param {string} clientID - The OAuth client ID.
             * @param {string} clientSecret - The OAuth client secret.
             * @param {string} callbackURL - The OAuth callback URL.
             * @returns {Object} Passport strategy.
             */
            createStrategy: function(clientID, clientSecret, callbackURL) {
                // Set up user serialization
                passport.serializeUser(function serialize(user, done) {
                    done(null, user.googleID);
                });
                passport.deserializeUser(function deserialize(googleID, done) {
                    User.findOne({
                        where: { googleID }
                    }).then(user => {
                        if (!user) {
                            return done(null, false);
                        }

                        return done(null, user);
                    }).catch(err => done(err));
                });

                // Create the strategy
                return new GoogleStrategy({
                    clientID, clientSecret, callbackURL, scope: [
                        'profile',
                        'https://www.googleapis.com/auth/plus.me'
                    ]
                }, function verify(accessToken, refreshToken, profile, done) {
                    User.findOrCreate({
                        where: { googleID: profile.id }
                    }).then(([user, created]) => {
                        if (!user) {
                            return done(null, created || false);
                        }

                        return done(null, user);
                    }).catch(err => done(err));
                });
            }
        }
    }
);

module.exports = User;

