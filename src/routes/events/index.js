/**
 * Event list page.
 *
 * @module src/routes/events
 */

import React from 'react';
import { shape, string, instanceOf } from 'prop-types';
import { Link, Route, Redirect, Switch } from 'react-router-dom';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';
import NotFound from 'bundle-loader?lazy!src/NotFound';
import events, { EventConfig } from './events.js';

const contentCtx = require.context(
    'bundle-loader?lazy!./content',
    true,
    /\.(js|md)$/
);

const AsyncNotFound = asyncComponent(NotFound, Spinner);

/**
 * React component for a single event.
 *
 * @param {Object} props - The component's props.
 * @param {module:src/routes/events/events.EventConfig} props.event - The event
 * configuration.
 * @returns {ReactElement} The component's elements.
 */
function EventComponent(props) {
    const { event: {
        title, location, date, contentPath
    } } = props;

    const Content = asyncComponent(contentCtx(contentPath), Spinner);

    return <div>
        <Link to=".."><h1>Events</h1></Link>
        <h2>{title}</h2>
        <h4>{date}</h4>
        <h5>{location}</h5>
        <Content />
    </div>;
}

EventComponent.propTypes = {
    event: instanceOf(EventConfig).isRequired
};

/**
 * Attempts to render the event at the current path.
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.match.params.path - The matched event path.
 * @returns {ReactElement} The rendered event, or a 404 page.
 */
function EventMatcher(props) {
    const path = props.match.params.path + '/';
    if (!(path in events.byPath)) {
        return <AsyncNotFound {...props} />;
    }

    return <EventComponent event={events.byPath[path]} />;
}

EventMatcher.propTypes = {
    match: shape({
        params: shape({
            path: string.isRequired
        })
    })
};

/**
 * Event list React component.
 *
 * @returns {ReactElement} The component's elements.
 */
function EventList() {
    return <div>
        <h1>Events</h1>
        {events.map((event, i) => {
            const {
                title, location, date, path
            } = event;

            return <div key={i}>
                <Link to={`./${path}`}><h2>{title}</h2></Link>
                <h4>{date}</h4>
                <h5>{location}</h5>
            </div>;
        })}
    </div>;
}

/**
 * Event page React component.
 *
 * @returns {ReactElement} The component's elements.
 */
export default function Events() {
    return <div>
        <Switch>
            <Route path="/events/:path/" strict component={EventMatcher} />
            <Route path="/events/:path" render={({ match }) => {
                const { path } = match.params;
                return <Redirect to={`./${path}/`} />;
            }} />
            <Route component={EventList} />
        </Switch>
    </div>;
}

