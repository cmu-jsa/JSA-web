/**
 * Main app module.
 *
 * @module src/App
 */

import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';
import { routeConfigFlat } from 'src/routeConfig';

import NotFound from 'bundle-loader?lazy!src/NotFound';
import Header from './Header';
import Footer from './Footer';
import styles from './index.less';

const routes = routeConfigFlat.map((config, i) => {
    const { path, component } = config;
    return <Route
        key={i}
        path={path}
        exact={path === '/'}
        strict
        component={component}
    />;
});

/**
 * React component for the entire app.
 *
 * @returns {ReactElement} The app's elements.
 */
export default function App() {
    return <BrowserRouter basename={__webpack_public_path__}>
        <div>
            <Header />
            <main className={styles.container}>
                <Switch>
                    { routes }
                    <Route path="/:path" render={({ match }) => {
                        const { path } = match.params;
                        return <Redirect to={`./${path}/`} />;
                    }} />
                    <Route component={asyncComponent(NotFound, Spinner)} />
                </Switch>
            </main>
            <Footer />
        </div>
    </BrowserRouter>;
}

