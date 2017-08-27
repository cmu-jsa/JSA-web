/**
 * Animated dropdown component. Implemented as a modal that closes itself once
 * it is clicked.
 *
 * @module src/Dropdown
 */

import React from 'react';

import Modal from 'src/Modal';

/**
 * Dropdown React component.
 */
export default class Dropdown extends Modal {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const onClick = this.state.isOpen ? this.close : this.open;
        return React.cloneElement(super.render(), { onClick });
    }
}

Dropdown.propTypes = {};

Object.keys(Modal.propTypes).forEach(key =>
    (Dropdown.propTypes[key] = Modal.propTypes[key])
);

