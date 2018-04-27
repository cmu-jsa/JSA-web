/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';
import { objectOf, func } from 'prop-types';

import Auth from 'src/Auth';
import AuthLevels from 'src/Auth/AuthLevels';
import Election, { electionShape } from 'src/Election';
import Logout from 'src/App/Logout';
import ListInput from 'src/ListInput';

import ElectionForm from './ElectionForm';
import styles from './index.less';

/**
 * Elections list React component.
 *
 * @private
 * @param {Object} props - The component's props.
 * @returns {ReactElement} The component's elements.
 */
function ElectionsList(props) {
    const { elections, onElectionChanged } = props;
    let elems = Object.keys(elections).map(id => {
        const election = elections[id];

        return <ElectionForm
            key={id}
            election={election}
            onElectionChanged={onElectionChanged}
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
    onElectionChanged: func
};

/**
 * Administration React component.
 *
 * @private
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
        if (Auth.authLevel < AuthLevels.ADMIN) {
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

            const { onElectionOpened } = this.props;
            onElectionOpened && onElectionOpened(id, title, candidates);
        } catch (err) {
            const openElectionMessage = <p>{err.message}</p>;
            this.setState({ openElectionMessage });
        }

        return void 0;
    }
}

ElectionsAdmin.propTypes = {
    onElectionOpened: func
};

/**
 * Elections React component.
 *
 * @alias module:src/routes/elections
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

        this.onElectionChanged = this.onElectionChanged.bind(this);
        this.onElectionOpened = this.onElectionOpened.bind(this);

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
        if (!Auth.loggedIn) {
            throw new Error('User must be logged in to render.');
        }

        const { elections } = this.state;
        const { onElectionChanged, onElectionOpened } = this;

        return <article className={styles.elections}>
            <h1>Elections</h1>
            <h3>Hello, {Auth.username}! <Logout /></h3>
            <ElectionsAdmin
                onElectionOpened={onElectionOpened}
            />
            <ElectionsList
                elections={elections}
                onElectionChanged={onElectionChanged}
            />
        </article>;
    }

    /**
     * Event handler for election changes.
     *
     * @param {string} id - The election's ID.
     * @param {Object?} changes - The changed election state, or `null` to
     * delete the election with the given ID.
     */
    onElectionChanged(id, changes) {
        this.setState(({ elections }) => {
            if (!(id in elections)) {
                return;
            }

            if (changes === null) {
                delete elections[id];
            } else {
                Object.assign(elections[id], changes);
            }

            return { elections };
        });
    }

    /**
     * Event handler for election openings.
     *
     * @param {string} id - The opened election's ID.
     * @param {string} title - The opened election's title.
     * @param {string} candidates - The opened election's candidates.
     */
    onElectionOpened(id, title, candidates) {
        this.setState(({ elections }) => {
            if (id in elections) {
                return;
            }

            elections[id] = {
                id, title, candidates,
                closed: false,
                voted: false
            };

            return { elections };
        });
    }
}

export default Elections;

