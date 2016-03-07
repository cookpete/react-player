var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: './src/ReactPlayer',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ReactPlayer.js',
    library: 'ReactPlayer'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src')
    }]
  },
  externals: {
    'react': 'React'
  }
}
