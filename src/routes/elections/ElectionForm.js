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

        const candidateOptions = candidates.map(candidate => {
            return <option
                key={candidate}
                value={candidate}
            >
                {candidate}
            </option>;
        });

        const selectPrompt = voted
            ? 'You have already voted!'
            : 'Select a candidate...';
        const submitMessage = voted
            ? 'You have already voted!'
            : 'Submit vote';

        return <form onSubmit={async event => {
            event.preventDefault();

            const { id } = this.props.election;
            const { select } = this;
            const candidate = select.value;

            // eslint-disable-next-line no-alert
            if (!window.confirm(
                `Are you sure you want to vote for "${candidate}" `
                + `in the election "${title}"?`
            )) {
                return;
            }

            select.value = '';

            Election.vote(id, candidate);

            const { onVoted } = this.props;
            onVoted && onVoted(id);
        }}>
            <p>{title}</p>
            <select
                required={true}
                disabled={voted}
                ref={select => (this.select = select)}
            >
                <option value=''>{selectPrompt}</option>
                {candidateOptions}
            </select>
            <button type='submit' disabled={voted}>
                {submitMessage}
            </button>
        </form>;
    }
}

ElectionForm.propTypes = {
    election: electionShape.isRequired,
    onVoted: func
};

export default ElectionForm;

