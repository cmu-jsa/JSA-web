'use strict';

const path = require('path');
const process = require('process');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

const action = process.argv[2];
const port = process.argv[3] || 8080;

const webpackCompiler = webpack(function getWebpackConfig(act) {
    switch (act) {
        case 'production':
            return require('./webpack.config.production.js');
        case 'live':
            return require('./webpack.config.live.js');
        default:
            return require('./webpack.config.js');
    }
}(action));

const webpackBuildFinished = (err, stats) => {
    if (err) {
        console.log('\n\n===== WEBPACK BUILD FAILED =====');
        throw err;
    } else {
        console.log('\n\n===== WEBPACK BUILD FINISHED =====');
        console.log(stats.toString({
            colors: true,
            timings: true,
            cached: false
        }));
    }
};

const webpackProgress = new ProgressBar(
    '[:bar] :percent eta :etas  :msg', {
        total: 100, complete: '=', incomplete: ' ', width: 10
    }
);

webpackCompiler.apply(new ProgressPlugin((percent, msg) => {
    webpackProgress.update(percent, { 'msg': msg });
}));

switch (action) {
    case 'watch':
        webpackCompiler.watch({}, webpackBuildFinished);
        return;
    case 'live': {
        const webpackDevServer = require('webpack-dev-server');
        const server = new webpackDevServer(webpackCompiler, {
            contentBase: [
                path.join(__dirname, 'dist'),
                path.join(__dirname, 'public')
            ],
            hot: true,
            compress: true,
            historyApiFallback: true,
            stats: { colors: true, timings: true, cached: false }
        });
        server.listen(port, 'localhost');
        return;
    }
    default:
        webpackCompiler.run(webpackBuildFinished);
}

