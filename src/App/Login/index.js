/**
 * Site-wide login page.
 *
 * @module src/App/Login
 */

import React from 'react';
import { shape, string } from 'prop-types';
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
            redirect: false
        };

        this.inputs = {
            username: null,
            password: null
        };

        this.login = this.login.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        if (this.state.redirect) {
            const { referer } = this.props.location.state || {
                referer: { pathname: '/' }
            };
            return <Redirect to={referer} />;
        }

        return <form className={styles.login} onSubmit={event => {
            event.preventDefault();
            this.login();
        }}>
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
            <input
                type='submit'
                value='Login'
            />
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

        await User.login(username, password);

        this.setState({ redirect: true });
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
    }).isRequired
};

