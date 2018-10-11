/**
 * Users page.
 *
 * @module src/routes/users
 */

import React from 'react';
import { func, objectOf } from 'prop-types';

import Auth from 'src/Auth';
import AuthLevels from 'src/Auth/AuthLevels';
import AuthUsers, { userShape } from 'src/Auth/Users';
import Logout from 'src/App/Logout';
import ConfirmButton from 'src/ConfirmButton';

import UserForm from './UserForm';
import genPassword from './genPassword';
import styles from './index.less';

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
            <fieldset>
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
            <fieldset>
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
            </fieldset>
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
        if (await this.create(
            username.value, password.value, auth.value
        ) !== null) {
            return;
        }

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
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async create(username, password, auth) {
        try {
            await AuthUsers.create(username, password, auth);

            const message = <p>
                Successfully created user &quot;{username}&quot; [{auth}].
            </p>;
            this.setState({ message });

            const authLevel = AuthLevels[auth];

            const { onUserCreated } = this.props;
            onUserCreated && onUserCreated(username, password, authLevel);

            return null;
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });

            return err;
        }
    }
}

UserCreate.propTypes = {
    onUserCreated: func
};

/**
 * Users list React component.
 *
 * @private
 */
class UsersList extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            searchString: ''
        };

        this.search = null;
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { users, onUserChanged, refresh } = this.props;
        const { searchString } = this.state;

        let elems = Object.keys(users).filter(username => {
            return username.indexOf(searchString) >= 0;
        }).sort((a, b) => {
            return a.localeCompare(b);
        }).map(username => {
            return <UserForm
                key={username}
                user={users[username]}
                onUserChanged={onUserChanged}
            />;
        });

        if (elems.length === 0) {
            elems = <p>No users found.</p>;
        }

        const refreshButton = refresh
            ? <button type='button' onClick={refresh}>
                Refresh
            </button>
            : null;

        return <section className={styles.list}>
            <h4 className={styles.header}>
                <span className={styles.title}>Available users</span>
                {refreshButton}
            </h4>
            <input
                type='username'
                autoComplete='off'
                placeholder='Search usernames'
                ref={search => (this.search = search)}
                onChange={() => {
                    this.setState({
                        searchString: this.search.value
                    });
                }}
            />
            {elems}
        </section>;
    }
}

UsersList.propTypes = {
    users: objectOf(userShape).isRequired,
    onUserChanged: func,
    refresh: func
};

/**
 * Users React component.
 *
 * @alias module:src/routes/users
 */
class Users extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            users: {},
            message: null
        };

        this.onUserCreated = this.onUserCreated.bind(this);
        this.onUserChanged = this.onUserChanged.bind(this);
        this.refresh = this.refresh.bind(this);

        this.refresh();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { message } = this.state;

        if (!Auth.loggedIn || Auth.authLevel < AuthLevels.ADMIN) {
            throw new Error('User must be logged in to render.');
        }

        const { users } = this.state;
        const { onUserCreated, onUserChanged, refresh } = this;

        return <article className={styles.users}>
            <h1>Users</h1>
            <h3>Hello, {Auth.username}! <Logout /></h3>
            <section>
                <h4>Create user</h4>
                <UserCreate onUserCreated={onUserCreated} />
            </section>
            {message}
            <UsersList
                users={users}
                onUserChanged={onUserChanged}
                refresh={refresh}
            />
        </article>;
    }

    /**
     * Event handler for user creation.
     *
     * @param {string} username - The user's username.
     * @param {string} password - The user's password.
     * @param {number} authLevel - The user's authentication level.
     */
    onUserCreated(username, password, authLevel) {
        this.setState(({ users }) => {
            users[username] = { username, password, authLevel };
            return { users };
        });
    }


    /**
     * Event handler for user changes.
     *
     * @param {string} username - The user's username.
     * @param {Object?} changes - The changed user state, or `null` to
     * delete the user with the given username.
     */
    onUserChanged(username, changes) {
        this.setState(({ users }) => {
            if (!(username in users)) {
                return;
            }

            if (changes === null) {
                delete users[username];
            } else {
                Object.assign(users[username], changes);
            }

            return { users };
        });
    }

    /**
     * Refreshes the user list.
     *
     * @returns {Promise} Resolves with `null` on success, or with an `Error` if
     * an error was handled.
     */
    async refresh() {
        try {
            const users = await AuthUsers.getAll();
            this.setState({ users, message: null });

            return null;
        } catch (err) {
            const message = <p>{err.message}</p>;
            this.setState({ message });

            return err;
        }
    }
}

export default Users;

