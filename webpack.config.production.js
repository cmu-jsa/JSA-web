'use strict';

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./webpack.config.base.js');

if (!config.module) {
    config.module = {};
}

// Use ExtractTextPlugin on any loader that uses style-loader
if (config.module.rules) {
    for (const l of config.module.rules) {
        const loader = 'style-loader';
        if (l.use === loader) {
            l.use = ExtractTextPlugin.extract({ loader });
        } else if (l.use[0] === loader)  {
            l.use = ExtractTextPlugin.extract({
                use: l.use.slice(1),
                fallback: loader
            });
        }
    }
}

if (!config.plugins) {
    config.plugins = [];
}

config.plugins.push(
    new CleanWebpackPlugin(['dist'], { verbose: true }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new ExtractTextPlugin({
        filename: '[name].[contenthash].min.css',
        allChunks: true
    })
);

module.exports = config;

