/**
 * Event list configuration.
 *
 * @module src/routes/events/events
 */

import eventConfigs from './events.csv';

/**
 * Parses a date string from the config.
 *
 * @param {string} str - The config string to parse.
 * @returns {Date} The parsed date.
 */
function parseConfigDateString(str) {
    return new Date(Date.parse(str));
}

/**
 * Formats the given date as a string.
 *
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date.
 */
function formatDate(date) {
    return date.toLocaleDateString(void 0, { timeZone: 'UTC' });
}

/**
 * An event's configuration.
 *
 * @class
 * @alias module:src/routes/events/events.EventConfig
 * @param {Object} config - Initial configuration data.
 * @param {string} config.title - The event's title.
 * @param {string} config.startDate - The event's start date.
 * @param {string} [config.endDate] - The event's end date, if any.
 * @param {string} config.location - The event's location.
 * @param {string} config.contentPath - The path to the event's content.
 */
function EventConfig(config) {
    const {
        title, location,
        contentPath: rawContentPath,
        startDate: rawStartDate,
        endDate: rawEndDate
    } = config;

    const startDate = parseConfigDateString(rawStartDate);
    const endDate = rawEndDate
        ? parseConfigDateString(rawEndDate)
        : null;

    const start = formatDate(startDate);
    const end = endDate
        ? formatDate(endDate)
        : null;

    const date = (!end || start === end)
        ? start
        : `${start} - ${end}`;

    let path;
    let contentPath = null;
    if (rawContentPath.startsWith('/')) {
        path = rawContentPath;  // Absolute URLs should be used directly.
    } else {
        path = rawContentPath.match(/^(.*)\.md$/)[1] + '/';
        contentPath = rawContentPath;
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
             * The event's start date.
             *
             * @type {Date}
             * @readonly
             */
            startDate: { value: startDate },
            /**
             * The event's end date, or `null` if none.
             *
             * @type {Date?}
             * @readonly
             */
            endDate: { value: endDate },
            /**
             * A string representing the event's start date.
             *
             * @type {string}
             * @readonly
             */
            start: { value: start },
            /**
             * A string representing the event's end date, or `null` if none.
             *
             * @type {string?}
             * @readonly
             */
            end: { value: end },
            /**
             * A string representing the event's start and end dates.
             *
             * @type {string}
             * @readonly
             */
            date: { value: date },
            /**
             * The event's location.
             *
             * @type {string}
             * @readonly
             */
            location: { value: location },
            /**
             * The path to the event's page.
             *
             * @type {string}
             * @readonly
             */
            path: { value: path },
            /**
             * The path for requiring the event's content, or `null` if none.
             *
             * @type {string?}
             * @readonly
             */
            contentPath: { value: contentPath && `./${contentPath}` }
        }
    );
}

const events = eventConfigs.map(config => new EventConfig(config))
    .sort((a, b) => b.startDate - a.startDate);

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

