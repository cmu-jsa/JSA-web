/**
 * Member list page.
 *
 * @module src/routes/members
 */

import React from 'react';
import { string, bool, func, shape } from 'prop-types';
import classNames from 'classnames';

import Modal from 'src/Modal';

import members from './members.csv';
import styles from './index.less';

/**
 * Information about a member.
 *
 * @typedef {Object} Member
 * @property {string} nameLast - Last name.
 * @property {string} nameFirst - First name.
 * @property {string} email - Email.
 */

/**
 * Stops an event from propagating.
 *
 * @param {Event} event - The event to stop propagating.
 */
function stopPropagation(event) {
    event.stopPropagation();
}

const memberShape = shape({
    nameLast: string.isRequired,
    nameFirst: string.isRequired,
    email: string.isRequired
});

/**
 * Member card button React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/members~Member} props.member - The member.
 * @param {boolean} props.isOpen - Whether or not the associated modal is open.
 * @param {Function} props.open - The modal-opening function.
 * @returns {ReactElement} The component's elements.
 */
function MemberButton(props) {
    const { member, isOpen, open } = props;
    const { nameFirst, nameLast } = member;

    const classes = classNames(styles.button, {
        [styles.open]: isOpen
    });

    return <div className={classes} onClick={open}>
        <h2>{nameFirst} {nameLast}</h2>
    </div>;
}

MemberButton.propTypes = {
    member: memberShape.isRequired,
    isOpen: bool,
    open: func
};

/**
 * Member card modal React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/members~Member} props.member - The member.
 * @param {boolean} props.isOpen - Whether or not the associated modal is open.
 * @param {Function} props.close - The modal-closing function.
 * @returns {ReactElement} The component's elements.
 */
function MemberModal(props) {
    const { member, isOpen, close } = props;
    const { email } = member;

    return <div className={styles.modal} onClick={close}>
        <div className={styles.content} onClick={stopPropagation}>
            <div className={styles.close} onClick={close} />
            <MemberButton member={member} isOpen={isOpen} />
            <p>Email: <a href={`mailto:${email}`}>{email}</a></p>
        </div>
    </div>;
}

MemberModal.propTypes = {
    member: memberShape.isRequired,
    isOpen: bool,
    close: func
};

/**
 * Member React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/members~Member} props.member - The member.
 * @returns {ReactElement} The component's elements.
 */
function Member(props) {
    const { member } = props;

    const { enter, enterActive, exit, exitActive } = styles;
    return <Modal
        className={styles.member}
        transition={{
            classNames: {
                enter, enterActive, exit, exitActive
            },
            timeout: 300
        }}
        button={<MemberButton member={member} />}
    >
        <MemberModal member={member} />
    </Modal>;
}

Member.propTypes = {
    member: memberShape.isRequired
};

/**
 * Member list React component.
 */
export default class Members extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = { searchString: '' };
        this.searchKeys = [
            'nameLast',
            'nameFirst',
            'email'
        ];
        this.onInputChange = this.onInputChange.bind(this);
    }

    /**
     * Determines the search score for a given member and search string.
     *
     * @param {src/routes/members~Member} member - The member.
     * @param {string} searchString - The search string.
     * @returns {number} The score for that member. Higher scores are better.
     */
    searchScore(member, searchString) {
        if (!searchString) {
            return;
        }

        const terms = searchString.toLowerCase().trim().split(/\s+/);

        return terms.reduce(
            (score, term) => {
                const termIndex = this.searchKeys.reduce(
                    (str, key) => {
                        return str + member[key].toLowerCase().trim();
                    },
                    ''
                ).indexOf(term);
                return score + (termIndex === -1 ? 0 : term.length);
            },
            0
        );
    }

    /**
     * Handler for `change` events on the search input.
     *
     * @param {Event} event - The event.
     */
    onInputChange(event) {
        const field = event.target.getAttribute('data-field');
        this.setState({ [field]: event.target.value });
    }

    /**
     * React lifecycle handler called when component is about to update.
     *
     * @param {Object} nextProps - The component's new props.
     * @param {Object} nextState - The component's new state.
     */
    componentWillUpdate(nextProps, nextState) {
        const { searchString } = nextState;
        if (searchString !== this.state.searchString) {
            members.forEach(m =>
                (m.searchScore = this.searchScore(m, searchString))
            );
        }
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const matches = members.filter(member =>
            member.searchScore === void 0
            || member.searchScore > 0
        ).sort((a, b) =>
            b.searchScore - a.searchScore
        );
        const amount = `${matches.length}/${members.length}`;
        return <div className={styles.members}>
            <div className={styles.header}>
                <h1>
                    Members <span className={styles.amount}>
                        {amount}
                    </span>
                </h1>
                <input
                    type="text"
                    placeholder="Search"
                    data-field="searchString"
                    onChange={this.onInputChange}
                />
            </div>
            <div className={styles.list}>
                {matches.map((member, i) =>
                    <Member key={i} member={member} />
                )}
            </div>
        </div>;
    }
}

