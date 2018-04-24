/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';
import { objectOf, func } from 'prop-types';

import User from 'src/User';
import Election, { electionShape } from 'src/Election';
import Logout from 'src/App/Logout';
import ListInput from 'src/ListInput';

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
 * Administration React component.
 */
class ElectionsAdmin extends React.PureComponent {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            openElectionMessage: null
        };

        this.inputs = {
            openElection: {
                title: null,
                candidates: null
            }
        };

    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (User.authLevel < User.AuthLevels.ADMIN) {
            return null;
        }

        const { openElectionMessage } = this.state;

        return <section className={styles.admin}>
            <h4>Administration</h4>
            <form onSubmit={event => {
                event.preventDefault();

                const { title, candidates } = this.inputs.openElection;
                const titleValue = title.value;
                const candidatesValues = candidates.values;
                title.value = '';
                candidates.reset();

                this.openElection(titleValue, candidatesValues);
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
                {openElectionMessage}
            </form>
        </section>;
    }

    /**
     * Opens an election.
     *
     * @param {string} title - The election's title.
     * @param {string[]} candidates - The election's candidates.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async openElection(title, candidates) {
        try {
            const id = await Election.open(title, candidates);

            this.setState({ openElectionMessage: null });

            const { onOpenElection } = this.props;
            onOpenElection && onOpenElection(id, title, candidates);
        } catch (err) {
            const openElectionMessage = <p>{err.message}</p>;
            this.setState({ openElectionMessage });
        }

        return void 0;
    }
}

ElectionsAdmin.propTypes = {
    onOpenElection: func
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

        (async() => {
            const elections = await Election.getAll();
            this.setState({ elections });
        })();
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

        const onOpenElection = (id, title, candidates) => {
            this.setState(({ elections }) => {
                if (id in elections) {
                    return;
                }

                elections[id] = {
                    id, title, candidates,
                    closed: false,
                    voted: false
                };
            });
        };

        const { elections } = this.state;

        return <article className={styles.elections}>
            <h1>Elections</h1>
            <h3>Hello, {User.username}! <Logout /></h3>
            <ElectionsAdmin onOpenElection={onOpenElection} />
            <ElectionsList elections={elections} onVoted={onVoted} />
        </article>;
    }
}

export default Elections;

