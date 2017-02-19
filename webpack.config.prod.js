var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: './src/demo/index',
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise',
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      comments: false
    }),
    new ExtractTextPlugin('app.css')
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'src')
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap!sass-loader?sourceMap' }),
      include: path.join(__dirname, 'src')
    }, {
      test: /normalize.css$/,
      loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
      include: path.join(__dirname, 'node_modules', 'normalize.css')
    }]
  }
}
