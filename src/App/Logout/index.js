/**
 * Logout button.
 *
 * @module src/App/Logout
 */

import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import User from 'src/User';

import styles from './index.less';

/**
 * Logout React component.
 *
 * @alias module:src/App/Logout
 */
const Logout = withRouter(props => {
    // TODO
    void props;
    void User;
    void Redirect;
    return <button className={styles.logout} />;
});

export default Logout;

