/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';
import { arrayOf, objectOf, shape, string } from 'prop-types';

import XHRpromise from 'src/XHRpromise';
import User from 'src/User';
import Logout from 'src/App/Logout';
import ListInput from 'src/ListInput';

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
 * @property {string[]} candidates - The election's candidates.
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
    let elems = Object.keys(elections).map(id => {
        const { title, candidates } = elections[id];

        const candidateElems = candidates.map(candidate => {
            return <li key={candidate}>{candidate}</li>;
        });

        return <li key={id}>
            {title}
            <ul>{candidateElems}</ul>
        </li>;
    });

    if (elems.length === 0) {
        elems = <li>No elections available.</li>;
    }

    return <section className={styles.list}>
        <h4>Available elections</h4>
        <ul>
            {elems}
        </ul>
    </section>;
}

ElectionsList.propTypes = {
    elections: objectOf(shape({
        id: string.isRequired,
        title: string.isRequired,
        candidates: arrayOf(string).isRequired
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

        this.openElectionPromise = null;

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

        return <section className={styles.admin}>
            <h4>Administration</h4>
            <form onSubmit={async event => {
                const form = event.target;
                event.preventDefault();
                await this.openElection();
                form.reset();
            }}>
                <ListInput
                    placeholder='Candidate' dedup
                    ref={input => (this.inputs.openElection.candidates = input)}
                />
                <div className={styles.submit}>
                    <input
                        type='text'
                        name='title'
                        ref={input => (this.inputs.openElection.title = input)}
                        placeholder='Title'
                    />
                    <button type='submit'>Open new election</button>
                </div>
            </form>
        </section>;
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

        return <article className={styles.elections}>
            <h1>Elections</h1>
            <h3>Hello, {User.username}! <Logout /></h3>
            {this.renderAdmin()}
            <ElectionsList elections={elections} />
        </article>;
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
            const { title, candidates } = list[id];
            elections[id] = { id, title, candidates };
        });
        this.setState({ elections });

        return void 0;
    }

    /**
     * Opens a new election.
     *
     * If an existing request is in progress, its promise is returned.
     *
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    openElection() {
        if (this.openElectionPromise !== null) {
            return this.openElectionPromise;
        }

        this.openElectionPromise = (async() => {
            try {
                const title = this.inputs.openElection.title.value;
                const candidates = this.inputs.openElection.candidates.values;

                const body = JSON.stringify({ title, candidates });

                const { responseText } = await XHRpromise(
                    'POST', API.elections, {
                        body,
                        contentType: 'application/json',
                        successStatus: 201
                    }
                );

                const id = responseText;
                this.setState(({ elections }) => {
                    elections[id] = { id, title, candidates };
                    return { elections };
                });
            } finally {
                this.openElectionPromise = null;
            }
        })();
        return this.openElectionPromise;
    }
}

export default Elections;

