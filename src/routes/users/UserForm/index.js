/**
 * Module for user form UI.
 *
 * @module src/routes/users/UserForm
 */

import React from 'react';
import { func } from 'prop-types';

import Auth from 'src/Auth';
import AuthUsers, { userShape } from 'src/Auth/Users';
import ConfirmButton from 'src/ConfirmButton';

import styles from './index.less';

/**
 * User form React component.
 *
 * @alias module:src/routes/users/UserForm
 */
class UserForm extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            passwordShown: false,
            message: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.refresh = this.refresh.bind(this);
        this.destroy = this.destroy.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { user } = this.props;
        const { passwordShown, message } = this.state;
        const { onSubmit } = this;

        const { username } = user;
        const authLevel = ('authLevel' in user)
            ? ` [${user.authLevel}]`
            : null;

        const destroyButton = username !== Auth.username
            ? <ConfirmButton type='button' onClick={this.destroy}>
                Destroy
            </ConfirmButton>
            : null;

        const passwordButton = ('password' in user)
            ? <button type='button' onClick={() => {
                this.setState(state => {
                    return { passwordShown: !state.passwordShown };
                });
            }}>
                {passwordShown ? user.password : 'Show password'}
            </button>
            : null;

        return <form className={styles.user} onSubmit={onSubmit}>
            <p className={styles.header}>
                <span className={styles.username}>
                    {username}{authLevel}
                </span>
                {destroyButton}
                {passwordButton}
                <button type='button' onClick={this.refresh}>
                    Refresh
                </button>
            </p>
            {message}
        </form>;
    }

    /**
     * Form submission handler.
     *
     * @param {Event} event - The event.
     */
    onSubmit(event) {
        event.preventDefault();

        // TODO
    }

    /**
     * Attempts to update user state.
     *
     * @param {Function} updater - The updating function. Called with the user's
     * username; should return a promise that resolves with the updated state.
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async update(updater) {
        try {
            const { username } = this.props.user;
            const update = await updater(username);

            this.setState({ message: null });

            const { onUserChanged } = this.props;
            onUserChanged && onUserChanged(username, update);

            return null;
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });

            return err;
        }
    }

    /**
     * Refreshes user state.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async refresh() {
        return await this.update(async username => {
            const result = await AuthUsers.get(username);
            delete result.username;
            return result;
        });
    }

    /**
     * Destroys the user.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async destroy() {
        return await this.update(async username => {
            await AuthUsers.destroy(username);
            return null;
        });
    }
}

UserForm.propTypes = {
    user: userShape.isRequired,
    onUserChanged: func
};

export default UserForm;

