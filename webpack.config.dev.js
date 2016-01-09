var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
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
      test: /\.scss$/,
      loader: 'style!css?sourceMap!sass?sourceMap',
      include: path.join(__dirname, 'src')
    }, {
      test: /normalize.css$/,
      loader: 'style?insertAt=top!css',
      include: path.join(__dirname, 'node_modules', 'normalize.css')
    }]
  }
}
