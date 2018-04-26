/**
 * Site-wide login page.
 *
 * @module src/App/Login
 */

import React from 'react';
import { shape, string, element } from 'prop-types';
import { Redirect } from 'react-router-dom';

import Auth from 'src/Auth';
import Spinner from 'src/Spinner';

import styles from './index.less';

/**
 * Login React component.
 */
export default class Login extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        const { loggedIn } = Auth;

        const loading = loggedIn === null;
        const redirect = loggedIn === true;

        this.state = {
            loading,
            redirect,
            message: null
        };

        this.inputs = {
            username: null,
            password: null
        };

        this.login = this.login.bind(this);

        if (loading) {
            (async() => {
                await Auth.refreshLoginStatus();
                this.setState({
                    loading: false,
                    redirect: Auth.loggedIn
                });
            })();
        }
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { location, prompt = 'Log in' } = this.props;
        const { loading, redirect, message } = this.state;

        if (loading) {
            return <Spinner />;
        }

        if (redirect) {
            const { referer } = location.state || {
                referer: { pathname: '/' }
            };
            return <Redirect to={referer} />;
        }

        return <form className={styles.login} onSubmit={event => {
            event.preventDefault();

            const { username, password } = this.inputs;
            const usernameValue = username.value;
            const passwordValue = password.value;
            password.value = '';

            this.login(usernameValue, passwordValue);
        }}>
            <input
                type='username'
                ref={input => (this.inputs.username = input)}
                placeholder='Username'
                required={true}
            />
            <input
                type='password'
                ref={input => (this.inputs.password = input)}
                placeholder='Password'
                required={true}
            />
            <button type='submit'>
                {prompt}
            </button>
            {message}
        </form>;
    }

    /**
     * Attempts to log in with the given credentials.
     *
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {Promise} Resolves when login has succeeded, or rejects with an
     * error.
     */
    async login(username, password) {
        try {
            await Auth.login(username, password);

            this.setState({ redirect: true, message: null });
        } catch (err) {
            const message = <p className={styles.error}>
                Login failed: {err.message}
            </p>;

            this.setState({ message });
        }

        return void 0;
    }
}

Login.propTypes = {
    location: shape({
        state: shape({
            referer: shape({
                pathname: string.isRequired
            }).isRequired
        })
    }).isRequired,
    prompt: element
};

