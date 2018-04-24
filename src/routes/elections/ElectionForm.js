/**
 * Election form.
 *
 * @module src/routes/elections/ElectionForm
 */

import React from 'react';
import { func } from 'prop-types';

import XHRpromise from 'src/XHRpromise';

import { API, electionShape } from './election';

/**
 * Election form React component.
 */
class ElectionForm extends React.PureComponent {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.votePromise = null;

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

        return <form onSubmit={event => {
            event.preventDefault();
            this.vote();
        }}>
            <p>{title}</p>
            <select
                required={true}
                disabled={voted}
                ref={select => (this.select = select)}
            >
                <option value=''>Select a candidate...</option>
                {candidateOptions}
            </select>
            <button type='submit' disabled={voted}>
                {voted ? 'You have already voted!' : 'Submit vote'}
            </button>
        </form>;
    }

    /**
     * Submits the chosen vote.
     *
     * If an existing request is in progress, its promise is returned.
     *
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    vote() {
        if (this.votePromise) {
            return this.votePromise;
        }

        const { id } = this.props.election;

        const body = this.select.value;
        const uri = `${API.elections}/${id}`;

        this.votePromise = (async() => {
            try {
                await XHRpromise('PUT', uri, {
                    body,
                    contentType: 'text/plain',
                    successStatus: 204
                });

                const { onVoted } = this.props;
                onVoted && onVoted(id);
            } finally {
                this.votePromise = null;
            }
        })();
        return this.votePromise;
    }
}

ElectionForm.propTypes = {
    election: electionShape.isRequired,
    onVoted: func
};

export default ElectionForm;

