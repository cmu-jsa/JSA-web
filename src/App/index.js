/**
 * Main app module.
 *
 * @module src/App
 */

import React from 'react';
import { number, func } from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import asyncComponent from 'src/async-component';
import Spinner from 'src/Spinner';
import { routeConfigFlat } from 'src/routeConfig';
import Auth from 'src/Auth';

import AsyncNotFound from 'bundle-loader?lazy!src/NotFound';
import AsyncLogin from 'bundle-loader?lazy!./Login';
import Header from './Header';
import Footer from './Footer';
import styles from './index.less';

const Login = asyncComponent(AsyncLogin, Spinner);
const NotFound = asyncComponent(AsyncNotFound, Spinner);

/**
 * Represents a route that needs authentication.
 *
 * @private
 * @param {Object} props - The properties for the route.
 * @returns {ReactElement} The component's elements.
 */
function AuthRoute(props) {
    const { authLevel, component: Component, ...rest } = props;

    return <Route {...rest} render={componentProps => {
        if (!Auth.loggedIn) {
            const redirect = {
                pathname: Auth.paths.login,
                state: { referer: componentProps.location }
            };
            return <Redirect to={redirect} />;
        }

        if (Auth.authLevel < authLevel) {
            return <NotFound {...componentProps} />;
        }

        return <Component {...componentProps} />;
    }} />;
}

AuthRoute.propTypes = {
    authLevel: number.isRequired,
    component: func.isRequired
};

const routes = routeConfigFlat.map(config => {
    const { path, component } = config;

    const props = {
        key: path,
        component,
        path,
        exact: path === '/',
        strict: true
    };

    return ('authLevel' in config)
        ? <AuthRoute authLevel={config.authLevel} {...props} />
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
const userRedirects = Object.keys(Auth.paths).map(key => {
    const path = Auth.paths[key];
    return redirectNoSlash(path);
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
                    { userRedirects }
                    <Route path={Auth.paths.login} component={Login} />
                    <Route component={NotFound} />
                </Switch>
            </main>
            <Footer />
        </div>
    </BrowserRouter>;
}

