const routeConfig = [{
    name: '',
    path: './home.js'
}, {
    name: 'login',
    path: './login.js'
}];

function configReducer(parent) {
    return (arr, config) => arr.concat(flattenConfig(config, parent));
}

function flattenConfig({ routeConfig: subRoutes, name, ...config }, parent) {
    config.pattern = `${parent}/${name}`;

    return subRoutes
        ? subRoutes.reduce(configReducer(config.pattern), [config])
        : config;
}

const routeConfigFlat = routeConfig.reduce(configReducer(''), []);

export { routeConfig as default, routeConfigFlat };

