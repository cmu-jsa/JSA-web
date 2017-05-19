import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import asyncComponent from '~/components/asyncComponent';
import Spinner from '~/components/spinner';
import NotFound from 'bundle-loader?lazy!~/components/NotFound';
import Header from '~/header';
import Footer from '~/footer';
import styles from './app.less';
import routeConfig, { routeConfigFlat } from '~/routeConfig';

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

export default function App() {
    return <BrowserRouter>
        <div>
            <Header routeConfig={routeConfig} />
            <div className={styles.container}>
                <Switch>
                    { routes }
                    <Route component={asyncComponent(NotFound, Spinner)} />
                </Switch>
            </div>
            <Footer routeConfig={routeConfig} />
        </div>
    </BrowserRouter>;
}

