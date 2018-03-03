const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [path.resolve(__dirname, 'src/Models.js')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'Models.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [require.resolve('babel-plugin-transform-runtime')],
          presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-stage-0'),
            require.resolve('babel-preset-react')
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    //new UglifyJsPlugin()
  ]
};
