/**
 * Users page.
 *
 * @module src/routes/users
 */

import React from 'react';

import Auth from 'src/Auth';
import AuthLevels from 'src/Auth/AuthLevels';
import AuthUsers from 'src/Auth/Users';
import ConfirmButton from 'src/ConfirmButton';

import styles from './index.less';
import genPassword from './genPassword';

/**
 * Option elements for authentication levels.
 *
 * @private
 * @readonly
 * @type {ReactElement[]}
 */
const AuthLevelOptions = [
    <option key='' value=''>Authentication level...</option>
].concat(Object.keys(AuthLevels).map(auth => {
    return <option key={auth} value={auth}>{auth}</option>;
}));
Object.freeze(AuthLevelOptions);

/**
 * User creation React component.
 *
 * @private
 */
class UserCreate extends React.PureComponent {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            passwordShown: false,
            message: null
        };

        this.inputs = {
            username: null,
            password: null,
            auth: null
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { passwordShown, message } = this.state;

        return <form className={styles.create} onSubmit={this.onSubmit}>
            <input
                type='username'
                autoComplete='off'
                ref={input => (this.inputs.username = input)}
                placeholder='Username'
                required={true}
            />
            <fieldset className={styles.password}>
                <input
                    type={passwordShown ? 'text' : 'password'}
                    autoComplete='off'
                    ref={input => (this.inputs.password = input)}
                    placeholder='Password'
                    required={true}
                />
                <button type='button' onClick={event => {
                    event.preventDefault();
                    this.setState(state => {
                        return { passwordShown: !state.passwordShown };
                    });
                }}>
                    {passwordShown ? 'Hide' : 'Show'}
                </button>
                <button type='button' onClick={event => {
                    event.preventDefault();
                    this.inputs.password.value = genPassword();
                }}>
                    Generate
                </button>
            </fieldset>
            <select
                autoComplete='off'
                ref={input => (this.inputs.auth = input)}
                required={true}
            >
                {AuthLevelOptions}
            </select>
            <ConfirmButton type='submit'>
                Create user
            </ConfirmButton>
            {message}
        </form>;
    }

    /**
     * Form submission handler.
     *
     * @private
     * @param {Event} event - The event.
     */
    async onSubmit(event) {
        event.preventDefault();

        const { username, password, auth } = this.inputs;
        await this.create(username.value, password.value, auth.value);

        username.value = '';
        password.value = '';
        auth.value = '';
    }

    /**
     * Attempts to create a new user.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {string} auth - The user's authentication level name.
     * @returns {Promise} Resolves on completion, or rejects with an error.
     */
    async create(username, password, auth) {
        try {
            await AuthUsers.create(username, password, auth);

            const message = <p>
                Successfully created user &quot;{username}&quot; [{auth}].
            </p>;
            this.setState({ message });
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });
        }

        return void 0;
    }
}

/**
 * Users React component.
 *
 * @alias module:src/routes/users
 */
class Users extends React.Component {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (!Auth.loggedIn || Auth.authLevel < AuthLevels.ADMIN) {
            throw new Error('User must be logged in to render.');
        }

        return <article className={styles.users}>
            <UserCreate />
        </article>;
    }
}

export default Users;

