// webpack.config.js
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/src/Models.js`,
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: 'Models.js',
    library: 'Models.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    /*
    new webpack.optimize.UglifyJsPlugin({
      debug: false,
      minimize: true,
      sourceMap: false,
      output: {
        comments: false
      },
      compressor: {  // eslint-disable-line camelcase
        warnings: false,
        unused: true,
        dead_code: true
      },
      mangle: false
    })
    */
  ],
  watch: true
};