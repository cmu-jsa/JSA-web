/**
 * Confirmation button.
 *
 * @module src/ConfirmButton
 */

import React from 'react';
import { func, node } from 'prop-types';

/**
 * Confirmation button React component.
 *
 * @alias module:src/ConfirmButton
 */
class ConfirmButton extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = { confirm: false };

        this.ref = null;
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const {
            confirmMessage = 'Are you sure? (Click to confirm.)',
            children,
            ...rest
        } = this.props;
        const { confirm } = this.state;

        const onBlur = confirm ? this.onBlur : this.props.onBlur;

        return <button
            {...rest}
            onClick={this.onClick}
            onBlur={onBlur}
            ref={ref => (this.ref = ref)}
        >
            {confirm ? confirmMessage : children}
        </button>;
    }

    /**
     * Click handler.
     *
     * @param {Event} event - The event.
     */
    onClick(event) {
        if (!this.state.confirm) {
            event.preventDefault();
            this.setState({ confirm: true });
            return;
        }

        const { onClick } = this.props;
        onClick && onClick.apply(this.ref, arguments);
    }

    /**
     * Blur handler.
     */
    onBlur() {
        this.setState({ confirm: false });

        const { onBlur } = this.props;
        onBlur && onBlur.apply(this.ref, arguments);
    }
}

ConfirmButton.propTypes = {
    onClick: func,
    onBlur: func,
    confirmMessage: node,
    children: node
};

export default ConfirmButton;

