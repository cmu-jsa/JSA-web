/**
 * Sponsor list page.
 *
 * @module src/routes/sponsors
 */

import React from 'react';
import { string, bool, func, shape } from 'prop-types';
import classNames from 'classnames';

import Modal from 'src/Modal';

import sponsors from './sponsors.csv';
import styles from './index.less';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';

/**
 * Information about a sponsor.
 *
 * @typedef {Object} Sponsor
 * @property {string} name - The official name of the sponsor.
 * @property {string} website - The url of the sponsor website.
 * @property {string} contentPath - The path to the content of the sponsor.
 * @property {string} logo - The path to the logo of the sponsor.
 */

const sponsorShape = shape({
    name: string.isRequired,
    website: string.isRequired,
    contentPath: string,
    logo: string.isRequired
});

const contentCtx = require.context(
    'bundle-loader?lazy!./content',
    true,
    /\.(js|md)$/
);

/**
 * Stops an event from propagating.
 *
 * @param {Event} event - The event to stop propagating.
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Sponsor card button (logo) React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/sponsors~Sponsor} props.sponsor - The sponsor.
 * @param {boolean} props.isOpen - Whether or not the associated modal is open.
 * @param {Function} props.open - The modal-opening function.
 * @returns {ReactElement} The component's elements.
 */
function SponsorLogo(props) {
    const { sponsor, isOpen, open } = props;
    const { name, logo } = sponsor;

    const classes = classNames(styles.button, {
        [styles.open]: isOpen
    });

    return <div className={classes} onClick={open}>
        <img
            className={styles.img}
            src={`/sponsors/${logo}`}
            alt={`${name} logo`}
        />
    </div>;
}

SponsorLogo.propTypes = {
    sponsor: sponsorShape.isRequired,
    isOpen: bool,
    open: func
};

/**
 * Sponsor card modal React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/sponsors~Sponsor} props.sponsor - The sponsor.
 * @param {boolean} props.isOpen - Whether or not the associated modal is open.
 * @param {Function} props.close - The modal-closing function.
 * @returns {ReactElement} The component's elements.
 */
function SponsorModal(props) {
    const { sponsor, close } = props;
    const { name, website, contentPath } = sponsor;

    const path = `./${contentPath}`;
    const Content = asyncComponent(contentCtx(path), Spinner);

    return <div className={styles.modal} onClick={close}>
        <div className={styles.content} onClick={stopPropagation}>
            <div className={styles.close} onClick={close} />
            <h2><a href={website} target="_blank">{name}</a></h2>
            <Content />
        </div>
    </div>;
}

SponsorModal.propTypes = {
    sponsor: sponsorShape.isRequired,
    isOpen: bool,
    close: func
};

/**
 * Sponsor React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/sponsors~Sponsor} props.sponsor - The sponsor.
 * @returns {ReactElement} The component's elements.
 */
function Sponsor(props) {
    const { sponsor } = props;

    const { enter, enterActive, exit, exitActive } = styles;
    return <Modal
        className={styles.sponsor}
        transition={{
            classNames: {
                enter, enterActive, exit, exitActive
            },
            timeout: 300
        }}
        button={<SponsorLogo sponsor={sponsor} />}
    >
        <SponsorModal sponsor={sponsor} />
    </Modal>;
}

Sponsor.propTypes = {
    sponsor: sponsorShape.isRequired
};

const searchKeys = [
    'name'
];

/**
 * Sponsor list React component.
 */
export default class Sponsors extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = { searchString: '' };
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    /**
     * Determines the search score for a given sponsor and search string.
     *
     * @param {src/routes/sponsors~Sponsor} sponsor - The sponsor.
     * @param {string} searchString - The search string.
     * @returns {number} The score for that sponsor. Higher scores are better.
     */
    searchScore(sponsor, searchString) {
        if (!searchString) {
            return;
        }

        const terms = searchString.toLowerCase().trim().split(/\s+/);

        return terms.reduce(
            (score, term) => {
                const termIndex = searchKeys.reduce(
                    (str, key) => {
                        return str + sponsor[key].toLowerCase().trim();
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
    onSearchChange(event) {
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
            sponsors.forEach(m =>
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
        const matches = sponsors.filter(sponsor =>
            sponsor.searchScore === void 0
            || sponsor.searchScore > 0
        );

        if (this.state.searchString) {
            matches.sort((a, b) =>
                b.searchScore - a.searchScore
            );
        }

        const amount = `${matches.length}/${sponsors.length}`;
        return <div className={styles.sponsors}>
            <div className={styles.header}>
                <h1>
                Our Sponsors <span className={styles.amount}>
                        {amount}
                    </span>
                </h1>

                <input
                    type="text"
                    placeholder="Search"
                    data-field="searchString"
                    onChange={this.onSearchChange}
                />
            </div>
            <div className={styles.list}>
                {matches.map((sponsor, i) =>
                    <Sponsor key={i} sponsor={sponsor} />
                )}
            </div>
        </div>;
    }
}

