import React from 'react';

import styles from './home.less';

export default function Home() {
    return <div className={styles.home}>
        <h1>Hello React!</h1>
        <a href="/secure">Secure area</a>
    </div>;
}

