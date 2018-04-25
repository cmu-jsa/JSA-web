/**
 * Election form.
 *
 * @module src/routes/elections/ElectionForm
 */

import React from 'react';
import { func } from 'prop-types';

import User, { AuthLevels } from 'src/User';
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
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { title, candidates, voted, closed } = this.props.election;
        const { message } = this.state;

        const candidateOptions = candidates.map(candidate => {
            return <option
                key={candidate}
                value={candidate}
            >
                {candidate}
            </option>;
        });

        let inputs;

        if (voted) {
            inputs = <p>You have already voted in this election.</p>;
        } else if (closed) {
            inputs = <p>This election is closed.</p>;
        } else {
            inputs = [
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
            ];
        }

        let closeButton = null;
        let destroyButton = null;

        if (User.authLevel >= AuthLevels.ADMIN) {
            if (!closed) {
                closeButton = <ConfirmButton onClick={event => {
                    event.preventDefault();
                    this.close();
                }}>
                    Close
                </ConfirmButton>;
            }

            destroyButton = <ConfirmButton onClick={event => {
                event.preventDefault();
                this.destroy();
            }}>
                Destroy
            </ConfirmButton>;
        }


        return <form className={styles.election} onSubmit={this.onSubmit}>
            <p className={styles.title}>
                <span>{title}</span>
                {closeButton}
                {destroyButton}
            </p>
            {inputs}
            {message}
        </form>;
    }

    /**
     * Form submission handler.
     *
     * @private
     * @param {Event} event - The event.
     */
    onSubmit(event) {
        event.preventDefault();

        const { select } = this;
        const candidate = select.value;
        select.value = '';

        this.vote(candidate);
    }

    /**
     * Attempts to update election state.
     *
     * @param {Function} updater - The updating function. Called with the
     * election's ID; should return a promise that resolves with the updated
     * election state.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async update(updater) {
        try {
            const { id } = this.props.election;
            const update = await updater(id);

            this.setState({ message: null });

            const { onElectionChanged } = this.props;
            onElectionChanged && onElectionChanged(id, update);
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });
        }

        return void 0;
    }

    /**
     * Votes for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @returns {Promise} Resolves on completion, or rejects with an error.
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
     * @returns {Promise} Resolves on completion, or rejects with an error.
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
     * @returns {Promise} Resolves on completion, or rejects with an error.
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

