/**
 * Site-wide footer component.
 *
 * @module src/App/Footer
 */

import React from 'react';
import { Link } from 'react-router-dom';

import routeConfig from 'src/routeConfig';
import styles from './index.less';

/**
 * Footer React component.
 *
 * @returns {ReactElement} The component's elements.
 */
export default function Footer() {
    const links = Object.keys(routeConfig.children)
        .map(name => {
            const child = routeConfig.children[name];
            if (child.hidden) {
                return null;
            }

            const { title, path } = child;
            return <Link key={path} to={path}>{title}</Link>;
        });

    const { title, path } = routeConfig;

    return <footer className={styles.footer}>
        <nav>
            <div className={styles.left}>
                <Link to={path}>{title}</Link>
                {links}
            </div>
            <div className={styles.right}>
                <span>
                    Inquiries: <a href='mailto:hmdougla@andrew.cmu.edu'>hmdougla@andrew.cmu.edu</a>
                </span>
                <span>
                    Site design: <a href='https://szz.io'>Stan Zhang</a>
                </span>
            </div>
        </nav>
    </footer>;
}

