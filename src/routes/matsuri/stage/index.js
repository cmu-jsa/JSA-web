/**
 * Performances list page.
 *
 * @module src/routes/stage
 */

import React from 'react';

import performances from './performances.csv';
import styles from './index.less';

/**
 * Performance list React component.
 */
export default class Performances extends React.Component {
    /**
     * Renders the component.
     *
     * @returns {ReactElement} The component's elements.
     */
    render() {
        return <div className={styles.performances}>

            <h1> Stage </h1>

            <p>
                Each year, Matsuri invites a variety of performers and
                performances from all around Pittsburgh. Stage performances at
                Matsuri can be enjoyed for <b>FREE</b>. Come enjoy the variety
                of multicultural shows available only at Matsuri!
            </p>

            <p>
                Also keep an eye (ear?) out for occasional events that
                will be happening on stage, including raffle ticket draws and
                Haiku contest winner announcements!
            </p>

            <p>
                MC: Simon Lenoe (Freshman Representative at CMUJSA)
            </p>

            <h2> Performance Schedule </h2>
            <table>
                <tr>
                    <th> Performer</th>
                    <th> Performance Type</th>
                    <th> Time</th>
                </tr>
                {performances.map((performance, i) =>
                    <tr key={i}>
                        <td> {performance.performer} </td>
                        <td> {performance.type} </td>
                        <td> {performance.time} </td>
                    </tr>
                )}
            </table>
            <br/>
        </div>;
    }
}
