import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config, { plugins } from './webpack.config.babel'

export const minifyPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    comments: false
  }),
  new webpack.LoaderOptionsPlugin({ minimize: true })
]

export default {
  ...config,
  devtool: 'source-map',
  entry: './src/demo/index',
  plugins: [
    ...plugins,
    ...minifyPlugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin({ filename: 'app.css' })
  ]
}
