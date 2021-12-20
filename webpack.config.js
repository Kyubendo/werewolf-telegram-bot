const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config({path: './.env'});
module.exports = {
    target: "node",
    entry: './src/Bot.ts',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.EnvironmentPlugin(Object.keys(dotenv.parsed || {})),
    ]
};