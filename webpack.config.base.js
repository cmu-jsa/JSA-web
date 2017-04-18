'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ctxDir = path.resolve(__dirname);
const srcDir = path.resolve(ctxDir, 'src');
const vendorDir = path.resolve(ctxDir, 'vendor');
const loadersDir = path.resolve(ctxDir, 'loaders');
const outDir = path.resolve(ctxDir, 'dist');

module.exports = {
    devtool: 'cheap-module-source-map',
    context: ctxDir,
    entry: {
        main: [srcDir],
        lib: ['react', 'react-dom', 'react-router']
    },
    output: {
        path: outDir,
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            '~': srcDir,
            '^': vendorDir
        },
        modules: [
            srcDir,
            'node_modules'
        ]
    },
    resolveLoader: {
        alias: {
            '>': loadersDir
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: [vendorDir, /node_modules/],
                use: [
                    'style-loader',
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                include: [vendorDir, /node_modules/],
                use: [
                    'style-loader',
                    'css-loader?importLoaders=2',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                include: [srcDir],
                use: [
                    'style-loader',
                    'css-loader'
                        + '?modules'
                        + '&localIdentName=[local]-[hash:base64:5]'
                        + '&importLoaders=1',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                include: [srcDir],
                use: [
                    'style-loader',
                    'css-loader'
                        + '?modules'
                        + '&localIdentName=[local]-[hash:base64:5]'
                        + '&importLoaders=2',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.md$/,
                use: ['>/markdown-react-loader']
            },
            {
                test: /\.csv$/,
                use: ['dsv-loader']
            },
            {
                test: /\.(eot|woff|ttf|svg|jpg|ico)$/,
                use: ['url-loader?limit=10000']
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['lib', 'manifest']
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};
