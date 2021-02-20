/**
 * Performances list page.
 *
 * @module src/routes/stage
 */

import React from 'react';

//import performances from './performances.csv';
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
                performances from all around Pittsburgh. Although with current COVID-19 conditions
                it has become more difficult to run in-person performances,
                we are planning to livestream all our performances so that anyone can watch them
                from across the world!
            </p>


            <p>
                Performers will be announced at a later date, so stay tuned!
            </p>
            
            
             
            
            
            
            
            

            

            
        </div>;
    }
}
/**
 * <h2> Performance Schedule </h2>

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
 */