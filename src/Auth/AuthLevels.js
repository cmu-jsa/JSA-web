/**
 * Module for authorization levels.
 *
 * @module src/Auth/AuthLevels
 */

/**
 * Authorization levels.
 *
 * @alias module:src/Auth/AuthLevels
 * @readonly
 * @enum {number}
 */
const AuthLevels = {
    USER: 0,
    ADMIN: 1000
};
Object.freeze(AuthLevels);
export default AuthLevels;

