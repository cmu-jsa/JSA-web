/**
 * Users page.
 *
 * @module src/routes/users
 */

import React from 'react';

import Auth from 'src/Auth';
import AuthLevels from 'src/Auth/AuthLevels';

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

        return <h3>Hello world!</h3>;
    }
}

export default Users;

