/**
 * Logout button.
 *
 * @module src/App/Logout
 */

import React from 'react';
import { shape, func, element } from 'prop-types';
import { withRouter } from 'react-router-dom';

import User from 'src/User';

import styles from './index.less';

/**
 * Logout React component.
 *
 * @alias module:src/App/Logout
 */
class Logout extends React.PureComponent {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { prompt = 'Log out' } = this.props;

        return <form className={styles.logout} onSubmit={event => {
            event.preventDefault();
            this.logout();
        }}>
            <button type='submit' disabled={!User.loggedIn}>
                {prompt}
            </button>
        </form>;
    }

    /**
     * Attempts to log out.
     *
     * @returns {Promise} Resolves when logout has succeeded, or rejects with an
     * error.
     */
    async logout() {
        const { history } = this.props;

        try {
            await User.logout();

            history.push(User.paths.login);
        } catch (err) {
            console.log(err);
        }

        return void 0;
    }
}

Logout.propTypes = {
    history: shape({
        push: func.isRequired
    }).isRequired,
    prompt: element
};

const LogoutWithRouter = withRouter(Logout);
export default LogoutWithRouter;

