/**
 * Event list page.
 *
 * @module src/routes/events
 */

import React from 'react';

//import ReactMarkdown from 'react-markdown';
//import Iframe from 'react-iframe';
import eventConfigs from './events.csv';
import EventList from './culturelist.js';

/**
 * Event page React component.
 *
 * @returns {ReactElement} The component's elements.
 */

export default function Events() {
    const events = eventConfigs;
    return <div>
        <div>
            <h1>Japanese Culture</h1>
            <p>Please check out our threads, each showcasing an aspect of Japanese culture below:</p>
            <ul>
                <li><a href = "/matsuriculture/art">Art</a></li>
                <li><a href = "/matsuriculture/food">Food</a></li>
                <li><a href = "/matsuriculture/games">Games</a></li>
                <li><a href = "/matsuriculture/literature">Literature</a></li>
                <li><a href = "/matsuriculture/music">Music</a></li>
            </ul>
            <h2>Featured Aspect:</h2>
            <EventList events = {events} thread = {"random"}/> 
        </div>
    </div>;
}

