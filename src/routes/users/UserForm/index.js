/**
 * Module for user form UI.
 *
 * @module src/routes/users/UserForm
 */

import React from 'react';
import { func } from 'prop-types';

import { userShape } from 'src/Auth/Users';

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

        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { username } = this.props.user;
        const { onSubmit } = this;

        return <form className={styles.user} onSubmit={onSubmit}>
            <h4>{username}</h4>
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
}

UserForm.propTypes = {
    user: userShape.isRequired,
    onUserChanged: func
};

export default UserForm;

