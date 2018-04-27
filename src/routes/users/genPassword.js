/**
 * Module for generating passwords.
 *
 * @module src/routes/users/genPassword
 */

const alphaStart = 'a'.charCodeAt(0);
const numStart = '0'.charCodeAt(0);
const space = ' '.charCodeAt(0);

/**
 * Generates a password.
 *
 * @param {number} [length=15] The password's length.
 * @returns {string} The password.
 */
function genPassword(length = 15) {     // eslint-disable-line max-statements
    const buf = new Array(length);

    for (let i = 0; i < length; i++) {
        const mod = i % 8;
        if (mod === 7) {
            buf[i] = space;
            continue;
        }

        let max;
        let start;
        if (mod < 3) {
            max = 26;
            start = alphaStart;
        } else {
            max = 10;
            start = numStart;
        }

        // Not technically safe, but...
        const offset = Math.floor(Math.random() * max);
        buf[i] = start + offset;
    }

    return String.fromCharCode.apply(String, buf);
}

export default genPassword;

