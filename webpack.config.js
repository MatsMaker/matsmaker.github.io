const path = typeof require !== 'undefined' ? require('path') : null;
const HtmlWebpackPlugin = typeof require !== 'undefined' ? require('html-webpack-plugin') : null;
const CopyWebpackPlugin = typeof require !== 'undefined' ? require('copy-webpack-plugin') : null;
const ESLintPlugin = typeof require !== 'undefined' ? require('eslint-webpack-plugin') : null;

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@static': path.resolve(__dirname, 'static')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      },
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
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['tsx', 'ts', 'js'],
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
