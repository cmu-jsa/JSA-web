/**
 * Elections page.
 *
 * @module src/routes/elections
 */

import React from 'react';

import User from 'src/User';
import Logout from 'src/App/Logout';

import styles from './index.less';

/**
 * Elections React component.
 */
class Elections extends React.Component {

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (!User.loggedIn) {
            throw new Error('User must be logged in to render.');
        }

        return <div className={styles.elections}>
            <h3>Hello, {User.username}! <Logout /></h3>
        </div>;
    }
}

export default Elections;

