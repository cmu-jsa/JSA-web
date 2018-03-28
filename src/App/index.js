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

const routes = routeConfigFlat.map(config => {
    const { path, component } = config;
    return <Route
        key={path}
        path={path}
        exact={path === '/'}
        strict
        component={component}
    />;
});

// Create redirects for missing trailing slashes.
const routeRedirects = routeConfigFlat.map(config => {
    const { path } = config;
    if (!path.endsWith('/')) {
        return null;
    }

    const noSlash = path.substr(0, path.length - 1);
    if (!noSlash) {
        return;
    }

    return <Route
        key={noSlash}
        path={noSlash}
        exact
        strict
        render={() => <Redirect to={path} />}
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
                    { routeRedirects }
                    { routes }
                    <Route component={asyncComponent(NotFound, Spinner)} />
                </Switch>
            </main>
            <Footer />
        </div>
    </BrowserRouter>;
}

