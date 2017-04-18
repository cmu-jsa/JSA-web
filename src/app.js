import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import asyncComponent from '~/components/asyncComponent';
import Spinner from '~/components/spinner';
import NotFound from 'bundle-loader?lazy!~/components/NotFound';
import Header from '~/header';
import Footer from '~/footer';
import styles from './app.less';
import routeConfig, { routeConfigFlat } from '~/routes';

const routesCtx = require.context(
    'bundle-loader?lazy!./routes',
    true,
    /\.(js|md)$/
);

const routes = routeConfigFlat.map((config, i) => {
    const { path, pattern, ...props } = config;
    const loadModule = routesCtx(path);
    const component = asyncComponent(loadModule, Spinner);
    return <Route
        {...props}
        key={i}
        exact path={pattern}
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
                    <Route component={asyncComponent(NotFound)} />
                </Switch>
            </div>
            <Footer routeConfig={routeConfig} />
        </div>
    </BrowserRouter>;
}

