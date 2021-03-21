/**
 * Org list page.
 * ADD route.json for this page to show up again
 * @module src/routes/j@cmu
 */

import React from 'react';
import { string, bool, func, shape } from 'prop-types';

import Modal from 'src/Modal';

import orgs from './orgs.csv';
import styles from './index.less';

/**
 * Information about an org.
 *
 * @typedef {Object} Org
 * @property {string} name - The official name of the org.
 * @property {string} website - The url of the org website.
 * @property {string} logo - The path to the logo of the org.
 */

const orgShape = shape({
    name: string.isRequired,
    website: string.isRequired,
    logo: string.isRequired
});

/**
 * Org card button (logo) React component.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/orgs~Org} props.org - The org.
 * @returns {ReactElement} The component's elements.
 */
function OrgLogo(props) {
    const { org } = props;
    const { name, logo, website } = org;

    return <div className={styles.button} onClick={() => window.open(website)}>
        <img
            className={styles.img}
            src={`/j@cmu/${logo}`}
            alt={`${name} logo`}
        />
        <h3> {name} </h3>
    </div>;
}

OrgLogo.propTypes = {
    org: orgShape.isRequired,
    isOpen: bool,
    open: func
};

/**
 * Org React component.
 *
 * Exists for the sole purpose of reusing Modal style.
 * //TODO: Refactor so style doesn't depend on Modal's style.
 *
 * @param {Object} props - The component's props.
 * @param {src/routes/orgs~Org} props.org - The org.
 * @returns {ReactElement} The component's elements.
 */
function Org(props) {
    const { org } = props;

    return <Modal
        className={styles.org}
        button={<OrgLogo org={org} />}
    >
        { null }
    </Modal>;
}

Org.propTypes = {
    org: orgShape.isRequired
};

/**
 * Org list React component.
 */
export default class Orgs extends React.Component {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        return <div className={styles.orgs}>

            <h1>
                J@CMU
            </h1>

            <p>
                J@CMU stands for Japan at Carnegie Mellon University,
                which is the alliance of all Japan-related organizations
                at Carnegie Mellon University. J@CMU traditionally co-hosts
                Matsuri with CMUJSA, by running a booth of their own at the
                event.

            </p>

            <h2>
                Organizations
            </h2>
            <div className={styles.list}>
                {orgs.map((org, i) =>
                    <Org key={i} org={org} />
                )}
            </div>
        </div>;
    }
}

