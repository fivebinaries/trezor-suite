/* eslint-disable */
const path = require('path');
const { execSync } = require('child_process');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { NODE_ENV } = process.env;

const environment = NODE_ENV || 'development';
const isDev = environment === 'development';
const pkgFile = require('./package.json');

const gitRevision = execSync('git rev-parse HEAD').toString().trim();

const { compilerOptions } = require('../../tsconfig.json');

const paths = compilerOptions.paths;
const pathKeys = Object.keys(paths).filter(p => !p.includes('*'));

const getPath = (key) => {
    let p = paths[key][0];
    if (p.endsWith('index')) {
        p = p.slice(0, -5);
    }

    return path.join('..', '..', p);
};

// Alias
const alias = {};
pathKeys.forEach(key => {
    alias[key] = path.resolve(getPath(key));
});

module.exports = {
    mode: environment,
    target: isDev ? 'web' : 'browserslist',
    devtool: isDev ? 'source-map' : false,
    devServer: {
        writeToDisk: true,
        port: 3000,
        historyApiFallback: true,
        hot: true, // HMR
    },
    entry: {
        app: path.join(__dirname, 'src', 'index.tsx'),
        // react: ['react', 'react-dom', 'react-refresh/runtime'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[id].[contenthash:8].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [
            'node_modules',
            '../../node_modules',
        ],
        alias,
        fallback: {
            // Polyfills API for NodeJS libraries in the browser
            crypto: require.resolve('crypto-browserify'),
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            // For Google OAuth library to work
            child_process: false,
            fs: false,
            net: false,
            tls: false,
        },
    },
    optimization: {
        /*
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'initial',
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                },
                components: {
                    chunks: 'initial',
                    name: 'components',
                    test: /[\\/]packages[\\/]components[\\/]/,
                },
            },
        },
        */
    },
    module: {
        rules: [
            // TypeScript/JavaScript
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            [
                                'babel-plugin-styled-components',
                                {
                                    displayName: true,
                                    preprocess: true,
                                },
                            ],
                            ...(isDev ? ['react-refresh/babel'] : []),
                        ],
                    },
                },
            },
            // Workers
            {
                test: /\.worker.ts$/,
                use: [
                    {
                        loader: 'worker-loader',
                        options: {
                            filename: 'static/worker.[contenthash].js',
                        },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-typescript'],
                        },
                    },
                ],
            },
            // Images
            {
                test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name].[contenthash:8].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
            process: {
                browser: true,
                env: {
                    SUITE_TYPE: JSON.stringify('web'),
                    VERSION: JSON.stringify(pkgFile.version),
                    COMMITHASH: JSON.stringify(gitRevision),
                    assetPrefix: JSON.stringify(process.env.assetPrefix),
                },
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'public', 'static'),
                    to: path.join(__dirname, 'dist', 'static'),
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
        new HtmlWebpackPlugin({
            minify: isDev,
            template: path.join(__dirname, 'src', 'static', 'index.html'),
            templateParameters: {
                assetPrefix: process.env.assetPrefix ?? '/',
                isOnionLocation: false, // TODO: Get from flags
            },
        }),
        // Webpack Dev server only
        ...(isDev ? [
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
            new BundleAnalyzerPlugin({
                openAnalyzer: false,
            }),
        ] : []),
    ],
};
