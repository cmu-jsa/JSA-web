/**
 * Animated modal component.
 *
 * @module src/Modal
 */

import React from 'react';
import { string, bool, object, arrayOf, element } from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import TransitionGroup from 'react-transition-group/TransitionGroup';

/**
 * React component that renders as its first child, or `null` if there are no
 * children in the `children` array.
 *
 * @param {Object} props - The component's props.
 * @param {ReactElement} props.children - The component's child.
 * @returns {ReactElement} The child.
 */
function FirstChild(props) {
    const { children } = props;
    return children[0] || null;
}

FirstChild.propTypes = {
    children: arrayOf(element).isRequired
};

/**
 * Modal React component.
 */
export default class Modal extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = { isOpen: false };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    /**
     * Adds `click` handler to the `window` that closes the modal.
     *
     * @private
     */
    addWindowHandler() {
        if (this.props.noWindowHandler) {
            return;
        }

        window.addEventListener('click', this.close);
        this.hasWindowHandler = true;
    }

    /**
     * Removes closing `click` handler from `window`.
     *
     * @private
     */
    removeWindowHandler() {
        if (this.hasWindowHandler) {
            window.removeEventListener('click', this.close);
            delete this.hasWindowHandler;
        }
    }

    /**
     * Opens the modal.
     *
     * @param {Event} [event] - If an event is passed, its propagation is
     * stopped.
     */
    open(event) {
        event && event.stopPropagation();

        this.setState({ isOpen: true }, () => {
            this.addWindowHandler();
        });
    }

    /**
     * Closes the modal.
     */
    close() {
        this.removeWindowHandler();
        this.setState({ isOpen: false });
    }

    /**
     * React lifecycle handler called when component is about to unmount.
     */
    componentWillUnmount() {
        this.removeWindowHandler();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { isOpen } = this.state;
        const { className, button, children, transition } = this.props;

        let modal;
        if (isOpen) {
            modal = React.cloneElement(children, {
                isOpen, close: this.close
            });

            if (transition) {
                modal = <CSSTransition key={isOpen} {...transition}>
                    {modal}
                </CSSTransition>;
            }
        } else {
            modal = null;
        }

        const modalButton = React.cloneElement(button, {
            isOpen, open: this.open
        });

        if (!transition) {
            return <span className={className}>
                {modalButton}
                {modal}
            </span>;
        }

        return <span className={className}>
            {modalButton}
            <TransitionGroup component={FirstChild}>
                {modal}
            </TransitionGroup>
        </span>;
    }
}

Modal.propTypes = {
    className: string,
    button: element.isRequired,
    children: element.isRequired,
    transition: object,
    noWindowHandler: bool
};

