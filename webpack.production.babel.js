import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config, { plugins } from './webpack.config.babel'

export const minifyPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    comments: false,
    mangle: {
      except: [ 'ReactPlayer' ]
    }
  }),
  new webpack.LoaderOptionsPlugin({ minimize: true })
]

export default {
  ...config,
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './src/demo/index'
  ],
  plugins: [
    ...plugins,
    ...minifyPlugins,
    new ExtractTextPlugin({ filename: 'app.css' })
  ]
}
