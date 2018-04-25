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
            confirmMessage: null,
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

        const onSubmitBlur = confirmMessage
            ? () => {
                this.setState({ confirmMessage: null });
            }
            : void 0;

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
                    onBlur={onSubmitBlur}>
                    {confirmMessage || 'Submit vote'}
                </button>
            ];

        return <form onSubmit={this.onSubmit}>
            <p>{title}</p>
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
    }

    /**
     * Votes for the given candidate.
     *
     * @param {string} candidate - The candidate to vote for.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async vote(candidate) {
        const { election } = this.props;
        const { id } = election;

        try {
            await Election.vote(id, candidate);

            this.setState({ message: null });

            const { onElectionChanged } = this.props;
            onElectionChanged && onElectionChanged(id, { voted: true });
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });
        }

        return void 0;
    }
}

ElectionForm.propTypes = {
    election: electionShape.isRequired,
    onElectionChanged: func
};

export default ElectionForm;

