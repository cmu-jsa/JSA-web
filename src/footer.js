import React from 'react';
import { Link } from 'react-router-dom';

import styles from './footer.less';

export default function Footer({ routeConfig }) {
    const links = routeConfig.filter(config =>
        'title' in config
    ).map(({ name, title }, i) =>
        <Link key={i} to={`/${name}`}>{title}</Link>
    );

    return <div className={styles.footer}>
        <div className={styles.navigation}>
            <Link to='/'>Home</Link>
            {links}
            <div className={styles.right}>
                <span>
                    Site design by <a href="https://szz.io">Stan Zhang</a>
                </span>
            </div>
        </div>
    </div>;
}

const { arrayOf, shape, string } = React.PropTypes;
Footer.propTypes = {
    routeConfig: arrayOf(shape({
        name: string.isRequired,
        title: string
    }))
};

