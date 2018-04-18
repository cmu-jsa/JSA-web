/**
 * Site-wide login page.
 *
 * @module src/App/Login
 */

import React from 'react';
import { shape, string } from 'prop-types';
import { Redirect } from 'react-router-dom';

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

        return <form className={styles.login} onSubmit={this.login}>
            <input
                type='text'
                name='username'
                placeholder='Username'
            />
            <input
                type='password'
                name='password'
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
     */
    login() {
        // TODO
        console.log('in!');
        this.setState({ redirect: true });
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

