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
 * Path to the login UI.
 *
 * @private
 */
const PATH_LOGIN_UI = '/login';

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
                pathname: PATH_LOGIN_UI,
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
                    <Route path={PATH_LOGIN_UI} component={asyncLogin} />
                    <Route component={asyncNotFound} />
                </Switch>
            </main>
            <Footer />
        </div>
    </BrowserRouter>;
}

