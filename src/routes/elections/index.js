/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';
import { objectOf, shape, string } from 'prop-types';

import XHRpromise from 'src/XHRpromise';
import User from 'src/User';
import Logout from 'src/App/Logout';

import styles from './index.less';

/**
 * API endpoints.
 *
 * @private
 * @readonly
 * @enum {string}
 */
const API = {
    /** Elections base URL. */
    elections: '/api/elections'
};

/**
 * Represents an election.
 *
 * @private
 * @typedef {Object} Election
 * @property {string} id - The election's ID.
 * @property {string} title - The election's title.
 */

/**
 * Elections list React component.
 *
 * @param {Object} props - The component's props.
 * @param {Object<string, Election>} props.elections - The elections to list.
 * @returns {ReactElement} The component's elements.
 */
function ElectionsList(props) {
    const { elections } = props;
    const elems = Object.keys(elections).map(id => {
        const { title } = elections[id];
        return <li key={id}>{title}</li>;
    });

    return <ul>
        {elems}
    </ul>;
}

ElectionsList.propTypes = {
    elections: objectOf(shape({
        id: string.isRequired,
        title: string.isRequired
    })).isRequired
};

/**
 * Elections React component.
 */
class Elections extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            elections: {}
        };

        this.inputs = {
            openElection: {
                title: null,
                candidates: null
            }
        };

        this.refreshElections();
    }

    /**
     * Renders administrator components.
     *
     * @returns {ReactElement} The component's elements.
     */
    renderAdmin() {
        if (User.authLevel < User.AuthLevels.ADMIN) {
            return null;
        }

        return <div className={styles.admin}>
            <form onSubmit={async event => {
                const form = event.target;
                event.preventDefault();
                await this.openElection();
                form.reset();
            }}>
                <input
                    type='text'
                    name='title'
                    ref={input => (this.inputs.openElection.title = input)}
                    placeholder='Title'
                />
                <button type='submit'>Open an election</button>
            </form>
        </div>;
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (!User.loggedIn) {
            throw new Error('User must be logged in to render.');
        }

        const { elections } = this.state;

        return <div className={styles.elections}>
            <h1>Elections</h1>
            {this.renderAdmin()}
            <h3>Hello, {User.username}! <Logout /></h3>
            <ElectionsList elections={elections} />
        </div>;
    }

    /**
     * Refreshes the elections list.
     *
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async refreshElections() {
        const { responseText } = await XHRpromise('GET', API.elections, {
            successStatus: 200
        });

        const list = JSON.parse(responseText);
        const elections = {};
        Object.keys(list).map(id => {
            const title = list[id];
            elections[id] = { id, title };
        });
        this.setState({ elections });

        return void 0;
    }

    /**
     * Opens a new election.
     *
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async openElection() {
        const title = this.inputs.openElection.title.value;
        const candidates = ['hello', 'world'];  // TODO

        const body = JSON.stringify({ title, candidates });

        const { responseText } = await XHRpromise('POST', API.elections, {
            body,
            contentType: 'application/json',
            successStatus: 201
        });

        const id = responseText;
        this.setState(({ elections }) => {
            elections[id] = { id, title };
            return { elections };
        });

        return void 0;
    }
}

export default Elections;

