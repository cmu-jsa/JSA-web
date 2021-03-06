/**
 * Election form.
 *
 * @module src/routes/elections/ElectionForm
 */

import React from 'react';
import { func } from 'prop-types';

import Auth from 'src/Auth';
import AuthLevels from 'src/Auth/AuthLevels';
import Election, { electionShape } from 'src/Election';
import ConfirmButton from 'src/ConfirmButton';

import styles from './index.less';

/**
 * Election form React component.
 *
 * @alias module:src/routes/elections/ElectionForm
 */
class ElectionForm extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            message: null
        };

        this.select = null;

        this.onSubmit = this.onSubmit.bind(this);
        this.refresh = this.refresh.bind(this);
        this.close = this.close.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    /**
     * Renders the component's buttons.
     *
     * @returns {ReactElement} The component's buttons.
     */
    renderButtons() {
        const { closed } = this.props.election;

        const buttons = [
            <button key='refresh' type='button' onClick={this.refresh}>
                Refresh
            </button>
        ];

        if (Auth.authLevel >= AuthLevels.ADMIN) {
            !closed && buttons.unshift(<ConfirmButton
                key='close'
                type='button'
                onClick={this.close}
            >
                Close
            </ConfirmButton>);

            buttons.unshift(<ConfirmButton
                key='destroy'
                type='button'
                onClick={this.destroy}
            >
                Destroy
            </ConfirmButton>);
        }

        return buttons;
    }

    /**
     * Renders the closed election.
     *
     * @returns {ReactElement} The closed election's elements.
     */
    renderClosed() {
        const { election } = this.props;
        const { finalVotes } = election;

        if (!finalVotes) {
            return <p key='closed'>
                This election is closed.
            </p>;
        }

        const voteElems = Object.keys(finalVotes).map(candidate => {
            return { candidate, votes: finalVotes[candidate] };
        }).sort((a, b) => {
            return b.votes - a.votes;
        }).map(({ candidate, votes }) => {
            return <li key={candidate}>{candidate}: {votes}</li>;
        });

        return <div key='finalVotes'>
            <h4>Final votes:</h4>
            <ol>{voteElems}</ol>
        </div>;
    }

    /**
     * Renders the component's content.
     *
     * @returns {ReactElement} The component's content.
     */
    renderContent() {
        const { election } = this.props;
        const { voted, closed } = election;

        const content = [];

        closed && content.push(this.renderClosed());

        voted && content.push(<p key='voted'>
            You have already voted in this election.
        </p>);

        if (!voted && !closed) {
            const { candidates } = election;

            const candidateOptions = candidates.map(candidate => {
                return <option
                    key={candidate}
                    value={candidate}
                >
                    {candidate}
                </option>;
            });

            content.push(
                <select
                    key='select'
                    required={true}
                    ref={select => (this.select = select)}
                >
                    <option value=''>Select a candidate...</option>
                    {candidateOptions}
                </select>,
                <ConfirmButton key='submit' type='submit'>
                    Submit vote
                </ConfirmButton>
            );
        }

        return content;
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { election } = this.props;
        const { title } = election;
        const { message } = this.state;

        const voteCountElem = 'voteCount' in election
            ? <span className={styles.voteCount}>
                (Votes so far: {election.voteCount})
            </span>
            : null;

        return <form className={styles.election} onSubmit={this.onSubmit}>
            <p className={styles.title}>
                <span className={styles.title}>{title}</span>
                {voteCountElem}
                {this.renderButtons()}
            </p>
            {this.renderContent()}
            {message}
        </form>;
    }

    /**
     * Form submission handler.
     *
     * @private
     * @param {Event} event - The event.
     */
    async onSubmit(event) {
        event.preventDefault();

        const { select } = this;
        if (await this.vote(select.value) !== null) {
            return;
        }

        select.value = '';
    }

    /**
     * Attempts to update election state.
     *
     * @param {Function} updater - The updating function. Called with the
     * election's ID; should return a promise that resolves with the updated
     * election state.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async update(updater) {
        try {
            const { id } = this.props.election;
            const update = await updater(id);

            this.setState({ message: null });

            const { onElectionChanged } = this.props;
            onElectionChanged && onElectionChanged(id, update);

            return null;
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });

            return err;
        }
    }

    /**
     * Refreshes election state.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async refresh() {
        return await this.update(async(id) => {
            const result = await Election.get(id);
            delete result.id;
            return result;
        });
    }

    /**
     * Votes for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async vote(candidate) {
        return await this.update(async(id) => {
            await Election.vote(id, candidate);
            return { voted: true };
        });
    }

    /**
     * Closes the election.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async close() {
        return await this.update(async(id) => {
            await Election.close(id);
            return { closed: true };
        });
    }

    /**
     * Destroys the election.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async destroy() {
        return await this.update(async(id) => {
            await Election.destroy(id);
            return null;
        });
    }
}

ElectionForm.propTypes = {
    election: electionShape.isRequired,
    onElectionChanged: func
};

export default ElectionForm;

