// webpack.config.js
var webpack = require('webpack');
var path = require('path');
var libraryName = 'Models';
var outputFile = libraryName + '.js';

module.exports = {
  entry: __dirname + '/src/Models.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'stage-0', 'react', 'react-native']
        }
      }
    ]
  },
  watch: true
};