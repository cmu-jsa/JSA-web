/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';
import { objectOf, func } from 'prop-types';

import XHRpromise from 'src/XHRpromise';
import User from 'src/User';
import Logout from 'src/App/Logout';
import ListInput from 'src/ListInput';

import { API, electionShape } from './election';
import ElectionForm from './ElectionForm';
import styles from './index.less';

/**
 * Elections list React component.
 *
 * @alias module:src/routes//elections/ElectionsList
 * @param {Object} props - The component's props.
 * @param {Object<string, Election>} props.elections - The elections to list.
 * @param {Function} props.onVoted - Event handler for votes. Called with the
 * election's ID.
 * @returns {ReactElement} The component's elements.
 */
function ElectionsList(props) {
    const { elections, onVoted } = props;
    let elems = Object.keys(elections).map(id => {
        const election = elections[id];

        return <ElectionForm
            key={id}
            election={election}
            onVoted={onVoted}
        />;
    });

    if (elems.length === 0) {
        elems = <p>No elections available.</p>;
    }

    return <section className={styles.list}>
        <h4>Available elections</h4>
        {elems}
    </section>;
}

ElectionsList.propTypes = {
    elections: objectOf(electionShape).isRequired,
    onVoted: func
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
                event.preventDefault();

                const form = event.target;
                const title = this.inputs.openElection.title.value;
                const candidates = this.inputs.openElection.candidates.values;

                await this.openElection(title, candidates);

                form.reset();
            }}>
                <ListInput
                    placeholder='Candidate' dedup
                    ref={input => (this.inputs.openElection.candidates = input)}
                />
                <div className={styles.submit}>
                    <input
                        type='text'
                        ref={input => (this.inputs.openElection.title = input)}
                        placeholder='Title'
                        required={true}
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

        const onVoted = id => {
            this.setState(({ elections }) => {
                elections[id].voted = true;
                return { elections };
            });
        };

        const { elections } = this.state;

        return <article className={styles.elections}>
            <h1>Elections</h1>
            <h3>Hello, {User.username}! <Logout /></h3>
            {this.renderAdmin()}
            <ElectionsList elections={elections} onVoted={onVoted} />
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
            const { title, candidates, voted } = list[id];
            elections[id] = { id, title, candidates, voted };
        });
        this.setState({ elections });

        return void 0;
    }

    /**
     * Opens a new election.
     *
     * If an existing request is in progress, its promise is returned.
     *
     * @param {string} title - The title for the election.
     * @param {string[]} candidates - The candidates for the election.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    openElection(title, candidates) {
        if (this.openElectionPromise) {
            return this.openElectionPromise;
        }

        const body = JSON.stringify({ title, candidates });

        this.openElectionPromise = (async() => {
            try {
                const { responseText } = await XHRpromise(
                    'POST', API.elections, {
                        body,
                        contentType: 'application/json',
                        successStatus: 201
                    }
                );

                const id = responseText;
                this.setState(({ elections }) => {
                    elections[id] = { id, title, candidates, voted: false };
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

