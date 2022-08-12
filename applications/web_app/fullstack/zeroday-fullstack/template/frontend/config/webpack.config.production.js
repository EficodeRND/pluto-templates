const path = require('path');
const { merge } = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

const config = require('./webpack.config.base');

module.exports = merge(config, {
  devtool: 'source-map',
  entry: {
    main: [path.join(__dirname, '../src/client.jsx')],
  },
  mode: 'production',
  plugins: [
    new ReplaceInFileWebpackPlugin([{
      dir: path.resolve(__dirname, '../build'),
      files: ['index.html'],
      rules: [{
        search: '<head>',
        replace: '<head>\n  <script src="/config/environment.js"></script>', // inject environment.js in production (corresponds to development envVars with definePlugin)
      }],
    }]),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, '../src/public/images'), to: 'images' }],
    }),
  ],
  module: {
    rules: [],
  },
  optimization: {
    emitOnErrors: false,
    minimizer: [
      new TerserPlugin(),
    ],
  },
});
