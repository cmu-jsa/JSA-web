/**
 * List input.
 *
 * @module src/ListInput
 */

import React from 'react';
import { string, bool } from 'prop-types';

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
        const { placeholder } = this.props;
        const { inputKeyPress } = this;

        let valueElems = this.state.values.map((value, i) => {
            const onClick = () => {
                this.setState(({ values }) => {
                    values.splice(i, 1);
                    return { values };
                });
            };

            return <li key={i} onClick={onClick}>
                {value}
            </li>;
        });

        if (valueElems.length === 0) {
            valueElems = <li className={styles.placeholder}>
                {placeholder}
            </li>;
        }

        return <label className={styles.listInput}>
            <input
                type='text'
                placeholder={placeholder}
                onKeyPress={inputKeyPress}
            />
            <ul>
                {valueElems}
            </ul>
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
        target.value = '';

        if (
            this.props.dedup
            && this.state.values.findIndex(v => v === value) >= 0
        ) {
            return;
        }

        this.setState(({ values }) => {
            values.push(value);
            return { values };
        });
    }
}

ListInput.propTypes = {
    placeholder: string,
    dedup: bool
};

export default ListInput;

