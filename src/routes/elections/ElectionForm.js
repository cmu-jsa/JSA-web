/**
 * Election form.
 *
 * @module src/routes/elections/ElectionForm
 */

import React from 'react';
import { func } from 'prop-types';

import Election, { electionShape } from 'src/Election';

/**
 * Election form React component.
 */
class ElectionForm extends React.PureComponent {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            confirmMessage: null,
            message: null
        };

        this.select = null;
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { title, candidates, voted } = this.props.election;
        const { confirmMessage, message } = this.state;

        const candidateOptions = candidates.map(candidate => {
            return <option
                key={candidate}
                value={candidate}
            >
                {candidate}
            </option>;
        });

        const inputs = voted
            ? <p>You have already voted in this election.</p>
            : [
                <select
                    key='select'
                    required={true}
                    ref={select => (this.select = select)}
                >
                    <option value=''>Select a candidate...</option>
                    {candidateOptions}
                </select>,
                <button
                    key='submit'
                    type='submit'
                    onBlur={() => {
                        this.state.confirmMessage && this.setState({
                            confirmMessage: null
                        });
                    }}>
                    {confirmMessage || 'Submit vote'}
                </button>
            ];

        return <form onSubmit={event => {
            event.preventDefault();

            if (!this.state.confirmMessage) {
                this.setState({
                    confirmMessage: 'Are you sure? (Click again to confirm.)'
                });
                return;
            }

            const { select } = this;
            const candidate = select.value;
            select.value = '';

            this.vote(candidate);
        }}>
            <p>{title}</p>
            {inputs}
            {message}
        </form>;
    }

    /**
     * Votes for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async vote(candidate) {
        const { id } = this.props.election;

        try {
            await Election.vote(id, candidate);

            this.setState({ message: null });

            const { onVoted } = this.props;
            onVoted && onVoted(id);
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });
        }

        return void 0;
    }
}

ElectionForm.propTypes = {
    election: electionShape.isRequired,
    onVoted: func
};

export default ElectionForm;

