import { optimize } from 'webpack'
import { PATH_STANDALONE, PATH_DIST } from './config.babel'
import config from './production.babel'

export default {
  ...config,
  entry: PATH_STANDALONE,
  output: {
    path: PATH_DIST,
    filename: 'ReactPlayer.standalone.js',
    library: 'renderReactPlayer',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
