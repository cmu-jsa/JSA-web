'use strict';

const process = require('process');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProgressBar = require('progress');

const webpackCompiler = webpack(function getWebpackConfig(action) {
    switch (action) {
        case 'production':
            return require('./webpack.config.production.js');
        case 'live':
            return require('./webpack.config.live.js');
        default:
            return require('./webpack.config.js');
    }
}(process.argv[2]));

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

let webpackPrevPercent = 0;
webpackCompiler.apply(new ProgressPlugin((percent, msg) => {
    webpackProgress.tick((percent - webpackPrevPercent) * 100, { 'msg': msg });
    webpackPrevPercent = percent;
}));

switch (process.argv[2]) {
    case 'watch':
        webpackCompiler.watch({}, webpackBuildFinished);
        return;
    case 'live': {
        const webpackDevServer = require('webpack-dev-server');
        const server = new webpackDevServer(webpackCompiler, {
            hot: true,
            compress: true,
            historyApiFallback: true,
            stats: { colors: true, timings: true, cached: false }
        });
        server.listen(8080, 'localhost');
        return;
    }
    default:
        webpackCompiler.run(webpackBuildFinished);
}

