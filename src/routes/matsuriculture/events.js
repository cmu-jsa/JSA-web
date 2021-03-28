/**
 * Event list configuration.
 *
 * @module src/routes/events/events
 */

import eventConfigs from './events.csv';



/**
 * An event's configuration.
 *
 * @class
 * @alias module:src/routes/events/events.EventConfig
 * @param {Object} config - Initial configuration data.
 * @param {string} config.title - The event's title.
 * @param {string} config.description- The event's start date.
 * @param {string} config.contentPath - The path to the event's content.
 * @param {string} config.test - The path to the event's content.
 */
function EventConfig(config) {
    const {
        title, description,
        contentPath: rawContentPath,
        url, test
    } = config;

    

    let path;

    if (rawContentPath.startsWith('/')) {
        path = rawContentPath;  // Absolute URLs should be used directly.
    } else {
        path = rawContentPath.match(/^(.*)\.md$/)[1] + '/';
        
    }

    Object.defineProperties(
        this,
        /** @lends module:src/routes/events/events~EventConfig# */
        {
            /**
             * The event's title.
             *
             * @type {string}
             * @readonly
             */
            title: { value: title },
            
            /**
             * The event's description
             *
             * @type {string}
             * @readonly
             */
            description: { value: description },
        
            /**
             * The path to the event's page.
             *
             * @type {string}
             * @readonly
             */
            path: { value: path },
            /**
             * The url path to the event's page.
             *
             * @type {string}
             * @readonly
            */
            url: { value: url },
            /**
             * The url path to the event's page.
             *
             * @type {string}
             * @readonly
            */
            test: { value: test }
           
        }
    );
    
}

const events = eventConfigs;
events.byPath = {};
events.forEach(event => (events.byPath[event.path] = event));

export {
    /**
     * The event configuration.
     *
     * @type {module:src/routes/events/events.EventConfig[]}
     */
    events as default,
    EventConfig
};

