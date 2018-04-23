/**
 * Main app module.
 *
 * @module src/App
 */

import React from 'react';
import { func } from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';
import { routeConfigFlat } from 'src/routeConfig';
import User from 'src/User';

import NotFound from 'bundle-loader?lazy!src/NotFound';
import Login from 'bundle-loader?lazy!./Login';
import Header from './Header';
import Footer from './Footer';
import styles from './index.less';

/**
 * Represents a route that needs authentication.
 *
 * @private
 * @param {Object} props - The properties for the route.
 * @returns {ReactElement} The component's elements.
 */
function AuthRoute(props) {
    const { component: Component, ...rest } = props;

    return <Route {...rest} render={componentProps => {
        return User.loggedIn
            ? <Component {...componentProps} />
            : <Redirect to={{
                pathname: User.paths.login,
                state: { referer: componentProps.location }
            }} />;
    }} />;
}

AuthRoute.propTypes = {
    component: func.isRequired
};

const routes = routeConfigFlat.map(config => {
    const { path, component, auth } = config;

    const props = {
        key: path,
        component,
        path,
        exact: path === '/',
        strict: true
    };

    return auth
        ? <AuthRoute {...props} />
        : <Route {...props} />;
});

/**
 * Redirects paths without a trailing slash to paths with a slash.
 *
 * @param {string} path - The path, including the trailing slash.
 * @returns {ReactElement} The redirect.
 */
function redirectNoSlash(path) {
    if (!path.endsWith('/')) {
        throw new Error('Path does not end with a slash.');
    }

    const noSlash = path.substr(0, path.length - 1);
    if (!noSlash) {
        return;
    }

    return <Redirect
        key={noSlash}
        from={noSlash}
        exact
        strict
        to={path}
    />;
}

// Create redirects for missing trailing slashes.
const routeRedirects = routeConfigFlat.map(config => {
    return redirectNoSlash(config.path);
});

// Create redirects for user UI paths.
const userRedirects = Object.keys(User.paths).map(key => {
    const path = User.paths[key];
    return redirectNoSlash(path);
});

const asyncLogin = asyncComponent(Login, Spinner);
const asyncNotFound = asyncComponent(NotFound, Spinner);

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
                    { userRedirects }
                    <Route path={User.paths.login} component={asyncLogin} />
                    <Route component={asyncNotFound} />
                </Switch>
            </main>
            <Footer />
        </div>
    </BrowserRouter>;
}

