'use strict';

const config = require('./webpack.config.base.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

if (!config.performance) {
    config.performance = {};
}

config.performance.hints = false;

if (!config.plugins) {
    config.plugins = [];
}

config.plugins.push(
    new CleanWebpackPlugin(['dist'], { verbose: true })
);
config.module = {
      rules: [
        {
          test: /\.md$/,
          use: 'raw-loader'
        }
      ]
    }

module.exports = config;

