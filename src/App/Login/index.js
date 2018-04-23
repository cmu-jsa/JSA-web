/**
 * Site-wide login page.
 *
 * @module src/App/Login
 */

import React from 'react';
import { shape, string, element } from 'prop-types';
import { Redirect } from 'react-router-dom';

import User from 'src/User';

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

        this.state = {
            redirect: false,
            message: null
        };

        this.inputs = {
            username: null,
            password: null
        };

        this.login = this.login.bind(this);

        (async() => {
            await User.refreshLoginStatus();
            this.setState({ redirect: User.loggedIn });
        })();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { location, prompt = 'Log in' } = this.props;
        const { redirect, message } = this.state;

        if (redirect) {
            const { referer } = location.state || {
                referer: { pathname: '/' }
            };
            return <Redirect to={referer} />;
        }

        return <form className={styles.login} onSubmit={event => {
            event.preventDefault();
            this.login();
        }}>
            {message}
            <input
                type='text'
                name='username'
                ref={input => (this.inputs.username = input)}
                placeholder='Username'
            />
            <input
                type='password'
                name='password'
                ref={input => (this.inputs.password = input)}
                placeholder='Password'
            />
            <button type='submit'>
                {prompt}
            </button>
        </form>;
    }

    /**
     * Attempts to log in.
     *
     * @returns {Promise} Resolves when login has succeeded, or rejects with an
     * error.
     */
    async login() {
        const { inputs } = this;
        const username = inputs.username.value;
        const password = inputs.password.value;

        try {
            await User.login(username, password);

            this.setState({ redirect: true });
        } catch (err) {
            const message = <p>
                {err.message}
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

