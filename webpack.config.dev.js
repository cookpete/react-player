var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
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
      'Promise': 'exports?global.Promise!es6-promise',
      'window.fetch': 'exports?self.fetch!whatwg-fetch'
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'test', 'karma')
      ]
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.scss$/,
      loader: 'style!css?sourceMap!sass?sourceMap',
      include: path.join(__dirname, 'src')
    }, {
      test: /normalize.css$/,
      loader: 'style?insertAt=top!css',
      include: path.join(__dirname, 'node_modules', 'normalize.css')
    }]
  },
  devtool: "source-map",
}
