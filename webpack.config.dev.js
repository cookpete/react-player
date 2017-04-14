var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './src/demo/index'
  ],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise',
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch'
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'test', 'karma')
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader?sourceMap!sass-loader?sourceMap',
      include: path.join(__dirname, 'src')
    }, {
      test: /normalize.css$/,
      loader: 'style-loader?insertAt=top!css-loader',
      include: path.join(__dirname, 'node_modules', 'normalize.css')
    }]
  }
}
