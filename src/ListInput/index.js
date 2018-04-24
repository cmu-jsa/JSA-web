/**
 * List input.
 *
 * @module src/ListInput
 */

import React from 'react';
import { string } from 'prop-types';

import styles from './index.less';

/**
 * List input React element.
 *
 * @alias module:src/ListInput
 */
class ListInput extends React.Component {
    /**
     * Initializes the component.
     */
    constructor() {
        super();

        this.state = {
            values: []
        };

        this.inputKeyPress = this.inputKeyPress.bind(this);

    }

    /**
     * The component's current values.
     *
     * @readonly
     * @type {string[]}
     */
    get values() {
        return this.state.values.slice();
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        const { values } = this.state;
        const { placeholder } = this.props;
        const { inputKeyPress } = this;

        const valueElems = values.map((value, i) => {
            return <p key={i}>{value}</p>;
        });

        return <label className={styles.listInput}>
            <input
                type='text'
                placeholder={placeholder}
                onKeyPress={inputKeyPress}
            />
            {valueElems}
        </label>;
    }

    /**
     * Key press handler.
     *
     * @param {KeyboardEvent} event - The event.
     */
    inputKeyPress(event) {
        const { key, target } = event;
        if (key !== 'Enter') {
            return;
        }

        event.preventDefault();

        const { value } = target;
        this.setState(({ values }) => {
            values.push(value);
            return { values };
        });
    }
}

ListInput.propTypes = {
    placeholder: string
};

export default ListInput;

