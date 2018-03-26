/**
 * Home page.
 *
 * @module src/routes
 */

import React from 'react';
import { instanceOf } from 'prop-types';
import { Link } from 'react-router-dom';

import events, { EventConfig } from 'src/routes/events/events.js';
import asyncComponent from 'src/async-component';
import HomeContent from 'bundle-loader?lazy!./index.md';
import styles from './index.less';

/**
 * Hero image React component.
 *
 * @returns {ReactElement} The component's elements.
 */
function Hero() {
    return <div className={styles.hero}>
        <h1 className={styles.left}>CMUJSA</h1>
    </div>;
}

/**
 * Event preview React component.
 *
 * @param {Object} props - The component's props.
 * @param {module:src/routes/events/events.EventConfig} props.event - The event
 * configuration.
 * @returns {ReactElement} The component's elements.
 */
function EventPreview(props) {
    const { event: {
        title, location, date, path
    } } = props;

    return <div>
        <h3><Link to={`/events/${path}`}>
            {title}
        </Link></h3>
        <p>{date} @ {location}</p>
    </div>;
}

EventPreview.propTypes = {
    event: instanceOf(EventConfig)
};

/**
 * Event list React component.
 *
 * @returns {ReactElement} The component's elements.
 */
function EventList() {
    return <div>
        <Link to="/events/"><h2>Upcoming Events</h2></Link>
        <ul>{events.map((event, i) =>
            <li key={i}><EventPreview event={event} /></li>
        )}</ul>
    </div>;
}

/**
 * Home page React component.
 *
 * @returns {ReactElement} The component's elements.
 */
export default function Home() {
    const Content = asyncComponent(HomeContent);

    return <div className={styles.home}>
        <Hero />
        <Content />
        <EventList />
    </div>;
}

