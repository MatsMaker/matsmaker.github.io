const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js'],
      failOnError: true,
      failOnWarning: false,
      emitError: true,
      emitWarning: true,
      overrideConfigFile: 'eslint.config.js'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: '.'
        }
      ]
    })
  ],
  devServer: {
    static: './dist',
    hot: true,
    port: 8080,
    client: {
      overlay: false
    }
  },
  performance: {
    maxAssetSize: 307200, // 300KB in bytes
    maxEntrypointSize: 307200, // 300KB in bytes
    hints: 'error' // Make build fail if exceeded
  }
};
