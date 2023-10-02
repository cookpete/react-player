import { optimize } from 'webpack'
import { PATH_REACT_PLAYER, PATH_DIST } from './config.babel'
import config from './production.babel'

export default {
  ...config,
  entry: PATH_REACT_PLAYER,
  output: {
    path: PATH_DIST,
    filename: 'ReactPlayer.js',
    library: 'ReactPlayer',
    libraryExport: 'default'
  },
  externals: {
    react: 'React'
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
const crypto = require('crypto')
const cryptoOrigCreateHash = crypto.createHash
crypto.createHash = algorithm => cryptoOrigCreateHash(algorithm === 'md4' ? 'sha256' : algorithm)
