const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config.base');

const envKeys = Object.keys(process.env).filter(key => !key.startsWith('npm'));
const envVars = {};
envKeys.forEach((envKey) => {
  envVars[envKey] = JSON.stringify(process.env[envKey]);
});

module.exports = merge(config, {
  cache: true,
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  entry: {
    main: [path.join(__dirname, '../src/client.jsx')],
  },
  devServer: {
    static: path.join(__dirname, '../src/public'),
    historyApiFallback: true,
    allowedHosts: 'all',
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8000,
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({ 'BUILD_ENV': envVars }),
  ],
});
