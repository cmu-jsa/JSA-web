/**
 * Users page.
 *
 * @module src/routes/users
 */

import React from 'react';
import { func, arrayOf } from 'prop-types';

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
        const { users, onUserChanged } = this.props;
        const { searchString } = this.state;

        let elems = users.filter(user => {
            return user.username.indexOf(searchString) >= 0;
        }).map(user => {
            return <UserForm
                key={user.username}
                user={user}
                onUserChanged={onUserChanged}
            />;
        });

        if (users.length === 0) {
            elems = <p>No users found.</p>;
        }

        return <section className={styles.list}>
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
    users: arrayOf(userShape).isRequired,
    onUserChanged: func
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
            users: []
        };

        this.onUserCreated = this.onUserCreated.bind(this);
        this.onUserChanged = this.onUserChanged.bind(this);

        (async() => {
            const users = await AuthUsers.getAll();
            this.setState({ users });
        })();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (!Auth.loggedIn || Auth.authLevel < AuthLevels.ADMIN) {
            throw new Error('User must be logged in to render.');
        }

        const { users } = this.state;
        const { onUserCreated, onUserChanged } = this;

        return <article className={styles.users}>
            <h1>Users</h1>
            <h3>Hello, {Auth.username}! <Logout /></h3>
            <section>
                <UserCreate onUserCreated={onUserCreated} />
            </section>
            <UsersList users={users} onUserChanged={onUserChanged} />
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
            users.push({ username, password, authLevel });
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
}

export default Users;

