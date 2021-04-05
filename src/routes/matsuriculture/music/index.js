/**
 * Event list page.
 *
 * @module src/routes/events
 */

import React from 'react';

//import ReactMarkdown from 'react-markdown';
//import Iframe from 'react-iframe';
import eventConfigs from '../events.csv';
import EventList from '../culturelist.js';

/**
 * Event page React component.
 *
 * @returns {ReactElement} The component's elements.
 */
export default function Events() {
    const events = eventConfigs;
    return <div>

        <h1>Japanese Music</h1>

        <EventList events = {events} thread = {"music"}/> 
    </div>;
}

