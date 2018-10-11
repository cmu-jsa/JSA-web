/**
 * Module for sending XMLHttpRequests.
 *
 * @module src/XHRpromise
 */

/**
 * Creates and sends an XMLHttpRequest.
 *
 * @alias module:src/XHRpromise
 *
 * @param {string} method - The method for the request.
 * @param {string} url - The URL for the request.
 * @param {Object} [opts] - Options for the request.
 * @param {boolean} [opts.withCredentials=true] - Whether or not to submit with
 * credentials.
 * @param {string} [opts.body] - The request body.
 * @param {string} [opts.contentType] - The content type for the body.
 * @param {number?} [opts.successStatus=null] - The expected response status for
 * successful requests. If `null`, the promise resolves for any status.
 * @returns {Promise} Resolves with the completed request, or rejects with an
 * error.
 */
function XHRpromise(method, url, opts = {}) {
    const {
        withCredentials = true,
        body,
        contentType,
        successStatus = null
    } = opts;

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.withCredentials = withCredentials;

        contentType && xhr.setRequestHeader('Content-Type', contentType);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== xhr.DONE) {
                return;
            }

            if (successStatus !== null && xhr.status !== successStatus) {
                return reject(new Error(
                    `'${method} ${url}' failed: `
                    + `expected status ${successStatus}, got ${xhr.status}`
                ));
            }

            return resolve(xhr);
        };

        xhr.send(body);
    });
}

export default XHRpromise;

