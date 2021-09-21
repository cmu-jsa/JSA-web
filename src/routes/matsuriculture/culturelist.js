/**
 * Event list page.
 *
 * @module src/routes/events
 */

import React from 'react';
import { any } from 'prop-types';


//import ReactMarkdown from 'react-markdown';
//import Iframe from 'react-iframe';
import ImgMediaCard from './culturecard.js';


const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

/**
 * Event list React component.
 *  
 * @param {Object} props Props for the React component
 * @returns {ReactElement} The component's elements.
 */
const EventList = (props) => {
    const events = props.events;
    events.byPath = {};
    events.forEach(event => (events.byPath[event.path] = event));

    if (props.thread.toString().trim() === 'random'){
        const random = getRandomInt(10);
        return <div>
            {events.map((event, i) => {
                
                const {
                    title, description, url, contentType, link
                } = event;
                
                return <div key={i}>
                    {random === i ?
                        <div>
                            <ImgMediaCard
                                title = {title}
                                description = {description}
                                url = {url}
                                contentType = {contentType}
                                link = {link}/>
                            <br>
                            </br>
                        </div>
                        : null}
                </div>;
            })}
        </div>;
    }

    return <div>
        {events.map((event, i) => {
            const {
                title, description, url, contentType, thread, link
            } = event;

            return <div key={i}>
                {props.thread.toString().trim() === thread.toString().trim() ? 
                    <div>
                        <ImgMediaCard
                            title = {title}
                            description = {description}
                            url = {url}
                            contentType = {contentType}
                            link = {link}/>
                        <br>
                        </br>
                    </div>
                    : null}
            </div>;
        })}
    </div>;
};
export default EventList;

EventList.propTypes = {
    events: any,
    thread: any
};
