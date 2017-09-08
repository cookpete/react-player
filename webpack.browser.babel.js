import path from 'path'
import webpack from 'webpack'
import config, { minifyPlugins } from './webpack.production.babel'

export default {
  ...config,
  entry: './src/ReactPlayer',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ReactPlayer.js',
    library: 'ReactPlayer'
  },
  externals: {
    'react': 'React'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          plugins: ['add-module-exports']
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'exports-loader?global.Promise!es6-promise',
      'window.fetch': 'exports-loader?self.fetch!whatwg-fetch'
    }),
    ...minifyPlugins
  ]
}
