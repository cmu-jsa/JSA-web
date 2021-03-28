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
//import ReactMarkdown from 'react-markdown';
//import Iframe from 'react-iframe';
import ImgMediaCard from './pain.js';

//import Pain from './pain';


/**
 * React component for a single event.
 *
 * @param {Object} props - The component's props.
 * @param {module:src/routes/events/events.EventConfig} props.event - The event
 * configuration.
 * @returns {ReactElement} The component's elements.
 */
/*
const body = `
# Schedule

## Date, Time, and Location

Matsuri 2021's events will be held virtually from Friday, April 9 to Sunday, April 11. We will be hosting multiple games and performances across
all three days. 

Spread the word and stay informed by joining and sharing the **[Facebook event](https://www.facebook.com/events/268303537457369/)**! 

Our performances will be live-streamed on our **[Youtube Channel](https://www.youtube.com/channel/UCJRtPt616S7M3qonS8Jg83Q)**. Please check back later for a link to the live-stream.

## Matsuri 2021 Table of Events

<iframe  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRNfFKUKdX-SXMS1EY4_kELX5Erp8LJS2zhTr9PnElw7gjImhQC624mhgqcfWe9aRAkwNSvSXO-PgDw/pubhtml?gid=855555506&amp;single=true&amp;widget=true&amp;headers=false" width="114%" height="920" frameborder="0" style="border:0" allowfullscreen></iframe>
';`;*/

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
        title,location, date, contentPath
    } } = props;

    const Content = contentPath
        && asyncComponent(contentCtx(contentPath), Spinner);

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

        
        {events.map((event, i) => {
            
            const {
                title, description, url,test
            } = event;
            console.log(event,'fuck youfasdoij');
            return <div key={i}>
                <ImgMediaCard title = {title} description = {description} url = {url} test = {test}></ImgMediaCard>
                {test}
                <br></br>
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
        <div>
            <h1>Japanese Culture</h1>
        </div>
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
/*
<ReactMarkdown source={body}></ReactMarkdown>
            <Iframe  url="https://docs.google.com/spreadsheets/d/e/2PACX-1vRNfFKUKdX-SXMS1EY4_kELX5Erp8LJS2zhTr9PnElw7gjImhQC624mhgqcfWe9aRAkwNSvSXO-PgDw/pubhtml?gid=855555506&amp;single=true&amp;widget=true&amp;headers=false"
                width="114%" 
                height="920" 
                frameBorder="0" 
                style="border:0" 
                allowFullScreen></Iframe>
*/

